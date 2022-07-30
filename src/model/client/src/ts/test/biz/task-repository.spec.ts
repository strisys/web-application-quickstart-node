import { expect } from 'chai';
import { Task, TaskRepository } from '../..';
import { KVStore } from 'model-core';

KVStore.current('model-client').isTesting = true;

xdescribe('TaskRepository', () => {
  const repository = new TaskRepository();

  describe('get', async function() {
    it('should return more than 0 entities', async () => {
      // Assemble/Arrange
      const entities: Task[] = (await repository.get());
      
      // Assert
      expect(entities.length).to.be.greaterThan(0);
    });
  });

  describe('post', async function() {
    it('should return one entity that was modified', async () => {
      // Arrange
      const entities: Task[] = (await repository.get());
      const description = (new Date()).getTime().toString();
      entities[0].description = description;

      // Act
      const entitiesPersisted = (await repository.post(entities));
      
      // Assert
      expect(entitiesPersisted.length).to.be.equal(1);
      expect(entitiesPersisted[0].description).to.be.equal(description);
    });
  });

  describe('delete', async function() {
    it('should return more one entity that was deleted', async () => {
      // Arrange
      const entities: Task[] = (await repository.get());

      // Act
      const entitiesDeleleted = (await repository.delete(entities));
      
      // Assert
      expect(entitiesDeleleted.length).to.be.greaterThan(0);
    });
  });
});