import { expect } from 'chai';
import { tryToQueryParamString, GetRequestParams } from './../../shared/fetch-util';
import { KVStore, KV } from 'model-core';

KVStore.current('model-client').isTesting = true;

describe('fetch-util', () => {
  describe('GetRequestParams', async function() {
    it('should return a valid url given the query string.', async () => {
      // Assemble/Act
      const qp = { region: 'North America', year: 2022, quarter: 1 };
      const params = new GetRequestParams("/api", qp);
      
      // Assert
      const expectedUrl = `http://localhost:3000/api?region=North+America&year=2022&quarter=1`;
      expect(params.url).to.be.eq(expectedUrl);
    });
  });

  describe('tryToQueryParamString', async function() {
    it('should return a query string given the name value pairs.', async () => {
      // Assemble/Act
      const qs = tryToQueryParamString({ region: 'North America', year: 2022, quarter: 1});
      
      // Assert
      expect(qs).to.not.be.null;
      expect(qs).to.be.eq('region=North+America&year=2022&quarter=1');
    });
  });
});