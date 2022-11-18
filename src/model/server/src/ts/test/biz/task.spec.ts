import { expect } from 'chai';
import { Task, TaskRepositoryFactory, ITaskRepository, TaskRepositoryType, generateUuid } from '../../';
import { getLogger } from '../util';

const logger = getLogger(module);
const DEFAULT_REPO_TYPE: TaskRepositoryType = 'in-memory';

const getRepository = async (type: TaskRepositoryType = DEFAULT_REPO_TYPE): Promise<ITaskRepository> => {
  return TaskRepositoryFactory.get(type);
}

describe('TaskRepository', () => {
  describe('get and getOne', function () {
    this.timeout((1000 * 10));

    it('should return more than 0 entities', async () => {
      // Assemble/Act
      const respository = (await getRepository());
      const entities = (await respository.get());

      // Assert
      expect(entities.length).to.be.greaterThan(0);

      // Assemble/Act
      const entity = (await respository.getOne(entities[0].uuid));

      // Assert
      expect(entity).is.not.null;
      expect(entity.isNull).is.false;
      expect(entity.uuid).is.equal(entities[0].uuid);
    });
  });

  describe('post', function () {
    it('should post one entity', async () => {
      // Assemble
      const respository = (await getRepository('in-memory'));
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
      const respository = (await getRepository('in-memory'));
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
      const respository = (await getRepository('in-memory'));
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