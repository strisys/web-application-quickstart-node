import { KVStore } from './../../../kv';
import { expect } from 'chai';
import { Task, ITaskState, KEY_LENGTH } from '../../../biz';

KVStore.current().isTesting = true;

describe('Task', () => {
  describe('constructor', function () {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: ITaskState = {
        id: '1',
        uuid: '',
        description: `description`,
        tags: null,
        syncStatus: 'unknown'
      };

      const entity = new Task(state)

      // Assert
      expect(entity.uuid).is.not.null.and.is.not.undefined;
      expect(entity.uuid.length).is.eq(KEY_LENGTH);
      expect(entity.description).to.be.eq(state.description);
      expect(entity.tags).is.not.null.and.is.not.undefined;
    });
  });
});