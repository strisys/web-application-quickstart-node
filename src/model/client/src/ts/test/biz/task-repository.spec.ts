import { expect } from 'chai';
import { Task, TaskRepository } from '../..';
import { KVStore } from 'model-core';

KVStore.current('model-client').isTesting = true;

describe('TaskRepository', () => {
  describe('get', async function() {
    it('should return more than 0 entities', async () => {
      // Assemble/Arrange
      const entities: Task[] = (await (new TaskRepository()).get());
      
      // Assert
      expect(entities.length).to.be.greaterThan(0);
    }).skip();
  });
});