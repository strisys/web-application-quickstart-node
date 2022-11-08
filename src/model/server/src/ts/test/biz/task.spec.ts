import { expect } from 'chai';
import { Task, TaskRepository, generateUuid } from '../../';
import { getLogger } from '../util';

const logger = getLogger(module);

describe('TaskRepository', () => {
  const respository = new TaskRepository();

  describe('get', function () {
    it('should return more than 0 entities', async () => {
      // Assemble/Act
      const entities = (await respository.get());

      // Assert
      expect(entities.length).to.be.greaterThan(0);
    });
  });

  describe('post', function () {
    it('should post one entity', async () => {
      // Assemble
      const length = (await respository.get()).length;
      const entity = new Task();
      entity.description = generateUuid();

      // Act
      const result = (await respository.post([entity]));

      // Assert
      expect(result.length).equal(1);
      expect(result[0].description).equal(entity.description);
      expect(length + 1).equal((await respository.get()).length);
    });
  });

  describe('deleteOne', function () {
    it('should delete on 1 entity', async () => {
      // Assemble/Act
      const entities = (await respository.get());

      // Act
      await respository.deleteOne(entities[0]);
      const postDeleteEntities = (await respository.get());

      // Assert
      let exists = Boolean(postDeleteEntities.find((t) => (t.id === entities[0].id)));
      expect(exists).to.be.false;

      exists = Boolean(postDeleteEntities.find((t) => (t.id === entities[1].id)));
      expect(exists).to.be.true;
    });
  });

  describe('delete', function () {
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