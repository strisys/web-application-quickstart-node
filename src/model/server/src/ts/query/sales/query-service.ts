import { SalesEntryQueryResult, ISalesEntryState, getLogger, KV, generateUuid } from 'model-core';
import { getData } from './data'

const logger = getLogger('model.server:query:sales');
let counter = 0;

export class SalesEntryQueryService {
  public async get(context: KV = {}): Promise<SalesEntryQueryResult> {
    logger(`fetching sales query results (context:=${JSON.stringify(context)}) from persistent store ...`);

    const tryFilter = () => {
      const data = getData();

      if ((!context) || (!Object.keys(context).length)) {
        return data;
      }

      let filtered: ISalesEntryState[] = data;

      if (context['region']) {
        filtered = filtered.filter((e) => (e.region === context['region']));
      }

      if (context['country']) {
        filtered = filtered.filter((e) => (e.country === context['country']));
      }

      if (context['city']) {
        filtered = filtered.filter((e) => (e.city === context['city']));
      }

      return filtered;
    }

    const results = tryFilter();
    logger(`sales query result fetched (context:=${JSON.stringify(context)}, data:=${results.length}) from persistent store`);

    return (new SalesEntryQueryResult({
      id: (++counter).toFixed(3).toString(),
      uuid: generateUuid(),
      data: results
    }));
  }
}