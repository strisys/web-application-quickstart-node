import { DefaultAzureCredential, AccessToken } from '@azure/identity';
import { fetch } from 'cross-fetch';
import process from 'process';

type TargetApiParameters = {
  clientId: string;
}

const azParameters: TargetApiParameters = {
  clientId: '5c3f9ed1-652e-4684-b82d-3586ba549308',
}

async function getData(token: AccessToken): Promise<void> {
  const url = 'http://localhost:3000/api/v1.0/tasks';

  const requestParams: RequestInit = {
    method: 'GET',
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json'],
      ['Authorization', `Bearer ${token.token}`]
    ]
  }

  console.log(`executing ${requestParams.method} request to ${url} ...`);
  const response = (await fetch(url, requestParams));
  const json = (await response.json());

  console.log(`---------------------------------------------------------`);
  console.log(json);
  console.log(`done!`);
}

async function main(): Promise<void> {
  console.log(`IMPORTANT: for this to work its assumed 'az login' was used to establish identity`);
  console.log(`getting token ...`);

  const credential = new DefaultAzureCredential();
  const scopes = [`api://${azParameters.clientId}/.default`];
  const token = (await credential.getToken(scopes));
  const seconds = 3;

  console.log(`token fetched successfully!`);
  console.log(`running API call in ${seconds} seconds ...`);

  setTimeout(async () => {
    await getData(token);
  }, (seconds * 1000));
}
main().catch((err) => {
  console.log("error code: ", err.code);
  console.log("error message: ", err.message);
  console.log("error stack: ", err.stack);
  process.exit(1);
});