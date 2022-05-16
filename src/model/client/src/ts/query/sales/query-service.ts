import * as mc from 'model-core';
import { exec, GetRequestParams } from '../../shared/fetch-util';

const logger = mc.getLogger('sales-query-service')
const baseUrl = '/api/v1.0';

export class SalesEntryQueryService {
  public async get(context: mc.KV = null): Promise<mc.SalesEntryQueryResult> {
    const url = `${baseUrl}/query/sales`;
    const response = (await exec(new GetRequestParams(url, context)));
    const json = (await response.value.json());

    return mc.SalesEntryQueryResult.from(json);
  }
}