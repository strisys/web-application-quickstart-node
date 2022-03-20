
import { fetch } from 'cross-fetch';
import * as mc from 'model-core';

const logger = mc.getLogger('sales-query-service')
const baseUrl = 'http://localhost:3000/api/v1.0';

export class SalesEntryQueryService {
  public async get(): Promise<mc.SalesEntryQueryResult> {
    const url = `${baseUrl}/query/sales`;
    logger(`fetching sales data ${url}`);

    const response = (await fetch(url));
    const json = (await response.json());

    return mc.SalesEntryQueryResult.from(json);
  }
}