import { expect } from 'chai';
import { Task, TaskRepository } from '../../biz/task';
import { getLogger } from '../util';

const logger = getLogger(module);

describe('TaskRepository', () => {
  const respository = new TaskRepository();

  describe('get', function() {
    it('should return more than 0 entities', async () => {
      // Assemble/Act
      const entities: Task[] = (await respository.get());
      
      // Assert
      expect(entities.length).to.be.greaterThan(0);
    });
  });

  describe('delete', function() {
    it('should delete on 1 entity', async () => {
      // Assemble/Act
      const entities: Task[] = (await respository.get());
      
      // Act
      await respository.delete(entities[0]);
      const postDeleteEntities: Task[] = (await respository.get());

      // Assert
      let exists = Boolean(postDeleteEntities.find((t) => (t.id === entities[0].id)));
      expect(exists).to.be.false;

      exists = Boolean(postDeleteEntities.find((t) => (t.id === entities[1].id)));
      expect(exists).to.be.true;
    });
  });
});