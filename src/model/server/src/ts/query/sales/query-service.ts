import * as mc from 'model-core';
import { getData } from './data'

export class SalesEntryQueryService {
  public async get(): Promise<mc.SalesEntryQueryResult> {
    return (new mc.SalesEntryQueryResult({ 
      id: '1', 
      data: getData()
    }));
  }
}