import * as mc from 'model-core';
import { tryExecGetJson, getApiPath } from '../../shared';

const logger = mc.getLogger('model.client:query:sales:sales-query-service');

export class SalesEntryQueryService {
  public async get(context: mc.KV = {}): Promise<mc.SalesEntryQueryResult> {
    logger(`executing client call to get sales results ...`);
    const json: mc.ISalesEntryQueryResultState = (await tryExecGetJson(getApiPath('query/sales'), context));
    return mc.SalesEntryQueryResult.from(json);
  }
}