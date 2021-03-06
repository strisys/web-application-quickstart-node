import { expect } from 'chai';
import { Task, TaskRepository } from '../../biz/task';
import { getLogger } from '../util';

const logger = getLogger(module);

describe('TaskRepository', () => {
  describe('get', function() {
    it('should return more than 0 entities', async () => {
      // Assemble/Act
      const entities: Task[] = await (new TaskRepository()).get();
      
      // Assert
      expect(entities.length).to.be.greaterThan(0);
    });
  });
});