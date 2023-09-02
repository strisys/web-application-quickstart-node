import { setup, expect } from './../../util';
import { Task, ITaskState, KEY_LENGTH } from '../../../biz';

setup();

describe('Task', () => {
  describe('serialization', function () {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: Partial<ITaskState> = {
        uuid: '',
        name: `name`,
        description: `description`,
        documents: [],
        tags: { 'tag': 'value' },
      };

      const assert = (entity: Task) => {
        expect(entity.uuid).is.not.eq(state.uuid);
        expect(entity.uuid.length).is.eq(KEY_LENGTH);
        expect(entity.name).to.be.eq(state.name);
        expect(entity.description).to.be.eq(state.description);
        expect(entity.documents.length).eq((state.documents || []).length);
        expect(entity.tags).is.not.null.and.is.not.undefined;
        expect(entity.tags).to.be.deep.equal(state.tags);
        expect(entity.tags === state.tags).is.false;
        expect(entity.isReadOnly).is.false;
        expect(entity.isNull).is.false;
        expect(entity.syncStatus).eq('new');

        return entity;
      }

      // Act / Assert
      const entity = assert(Task.from(assert(Task.create(state)).toJSON(true)));

      const array: Array<Task> = Task.from([entity.state]);
      expect(Array.isArray(array)).is.true;
      expect(array.length).eq(1);
      expect(array[0].isNull).is.false;
    });
  });
});