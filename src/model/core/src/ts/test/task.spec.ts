import { expect } from 'chai';
import { Task, ITaskState } from '../task';

describe('Task', () => {
  describe('constructor', function() {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: ITaskState = { id: '1', description: `description` };
      const entity = new Task(state)
      
      // Assert
      expect(entity.id).to.be.eq(state.id);
      expect(entity.description).to.be.eq(state.description);
    });
  });
});