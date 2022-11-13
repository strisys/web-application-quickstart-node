import { getLogger } from 'model-core';
import { TokenCredential, DefaultAzureCredential, AccessToken } from '@azure/identity';
import { SecretStoreFactory } from './secret-store';
import * as sql from 'mssql';

export { ConnectionPool, IResult } from 'mssql';
export { getLogger };

export type TokenCredentialOrNull = (TokenCredential | null);
type ConnectionPoolOrNull = (sql.ConnectionPool | null);

const logger = getLogger('model.server:shared:sql-server');

enum ConfigKey {
  AD_TENANT_ID_KEY = 'AZURE-AD-TENANT',
  AD_CLIENT_ID_KEY = 'AZURE-AD-APP-ID',
  DB_SERVER_KEY = 'DB-SERVER',
  DB_DATABASE_KEY = 'DB-DATABASE',
}

const CONFIG_KEYS = [ConfigKey.AD_TENANT_ID_KEY, ConfigKey.AD_CLIENT_ID_KEY, ConfigKey.DB_SERVER_KEY, ConfigKey.DB_DATABASE_KEY];

const sqlConfig: sql.config = {
  database: '<provide-this-value>',
  server: '<provide-this-value>',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  authentication: {
    type: 'azure-active-directory-access-token',
    options: {
      token: '<provide-this-value>',
      clientId: '<provide-this-value>',
      tenantId: '<provide-this-value>'
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    appName: 'WebApplicationQuickstart',
  }
}

const getSqlConfig = async (token: string): Promise<sql.config> => {
  logger(`getting database connection data for the specified token ...`);

  const beforeConnect = (conn: sql.Connection) => {
    conn.once('connect', err => { err ? logger(`failed to connect to sql server (error:=${err})`) : logger('mssql connected') })
    conn.once('end', err => { err ? logger(`failed to end connection to sql server (error:=${err})`) : logger('mssql disconnected') })
  }

  const config: sql.config = JSON.parse(JSON.stringify(sqlConfig));

  const secretStore = SecretStoreFactory.get('azure-key-vault');
  const values = (await secretStore.getMany(CONFIG_KEYS));

  config.server = values[ConfigKey.DB_SERVER_KEY];
  config.database = values[ConfigKey.DB_DATABASE_KEY];
  config.authentication!.options.tenantId = values[ConfigKey.AD_TENANT_ID_KEY];
  config.authentication!.options.clientId = values[ConfigKey.AD_CLIENT_ID_KEY];
  config.authentication!.options.token = token;

  return { ...config, beforeConnect };
}

const getConnectionPool = async (credential: TokenCredential): Promise<sql.ConnectionPool> => {
  const accessToken = (await credential.getToken(`https://sql.azuresynapse-dogfood.net/.default`));

  if (!accessToken) {
    throw new Error(`failed to get connection pool for sql server.  could not get access token`)
  }

  return sql.connect((await getSqlConfig(accessToken.token)));
}

class StaticTokenCredential implements TokenCredential {
  constructor(private accessToken: AccessToken) {
  }

  async getToken(): Promise<AccessToken> {
    return this.accessToken;
  }
}

export const toCredential = (userAssertionToken: string): TokenCredential => {
  const expiration = new Date((new Date()).getFullYear(), 0, 14).getMilliseconds();
  return (new StaticTokenCredential({ token: userAssertionToken, expiresOnTimestamp: expiration }))
}

export class SqlClient {
  private readonly _credential: TokenCredential;
  private _pool: ConnectionPoolOrNull = null;

  public constructor(credential: TokenCredentialOrNull = null) {
    this._credential = (credential || new DefaultAzureCredential());
  }

  private async getConnectPool(): Promise<sql.ConnectionPool> {
    return (this._pool ?? (this._pool = await getConnectionPool(this._credential)));
  }

  public async query(sql: string): Promise<sql.IResult<any>> {
    try {
      logger(`fetching rows from persistent store ... (sql:=${sql})`);
      const pool: sql.ConnectionPool = (await this.getConnectPool());
      const recs: sql.IResult<any> = (await pool.query(sql));
      logger(`${recs.recordset.length} row(s) fetched persistent store!`);

      return recs;
    }
    catch (err) {
      const message = `failed to fetch recordset from persistent store (sql:=${sql})`;
      logger(message);
      throw new Error(message);
    }
  }

  public async queryAndMap<T>(sql: string, map: (row: any) => T): Promise<Array<T>> {
    return (await this.query(sql)).recordset.map(map);
  }
}