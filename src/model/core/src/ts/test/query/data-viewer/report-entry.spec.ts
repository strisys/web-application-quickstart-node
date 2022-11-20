import { expect } from 'chai';
import { KEY_LENGTH } from '../../..';
import * as sut from '../../../query/data-viewer';

describe('ReportEntry', () => {
  describe('constructor', function () {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: sut.IReportEntryState = { name: 'stocks', version: '1.0', id: '', uuid: '', data: {} };
      const entity = new sut.ReportEntry(state)

      // Assert
      expect(entity.id).eq('stocks v1.0');
      expect(entity.uuid).is.not.null.and.is.not.undefined;
      expect(entity.name).eq(state.name);
      expect(entity.version).eq(state.version);
      expect(entity.uuid.length).is.eq(KEY_LENGTH);
      expect(entity.data).is.not.null;
    });
  });
});