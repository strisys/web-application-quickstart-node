import * as mc from 'model-core';
import { getData } from './data'

export class SalesEntryQueryService {
  public async get(context: mc.KV = null): Promise<mc.SalesEntryQueryResult> {
    const tryFilter = () => {
      const data = getData();

      if ((!context) || (!Object.keys(context).length)) {
        return data;
      }

      let filtered: mc.ISalesEntryState[] = data;

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

    return (new mc.SalesEntryQueryResult({ 
      id: '1', 
      data: tryFilter()
    }));
  }
}