import { Task, ITaskState, generateUuid, getLogger } from 'model-core';

type TaskStateOmit = Omit<ITaskState, ('id' | 'uuid' | 'tags' | 'syncStatus')>;
const taskDescriptions = ['Refactor this app', 'Watch YouTube', 'Read About Frogs', 'Call Mother', 'Buy Groceries', 'Bake Cake'];

const logger = getLogger('model.server:biz:task');
let counter = 0;

const generateFakeState = (data: TaskStateOmit): ITaskState => {
  return {
    id: (++counter).toFixed(3).toString(),
    uuid: generateUuid(),
    description: data.description,
    tags: {},
    syncStatus: 'sychronized'
  }
}

// NOTE: This is data that would come from a document or relational database
let cache: ITaskState[] = taskDescriptions.map((d) => generateFakeState({ description: d }));

export class TaskRepository {
  public get(): Promise<Task[]> {
    logger(`fetching tasks from persistent store ...`);
    const entities = Task.from(cache);
    logger(`${entities.length} task(s) fetched persistent store!`);
    return Promise.resolve(entities);
  }

  public async getOne(id: string): Promise<Task> {
    logger(`fetching task (id:=${id}) from persistent store ...`);

    const state = cache.find((c) => ((c.id === id) || (c.uuid === id)));
    return ((state) ? (new Task(state)) : Task.null);
  }

  public post(entities: Array<Task>): Promise<Array<Task>> {
    if ((!entities) || (!entities.length)) {
      return Promise.resolve([]);
    }

    entities.forEach((e) => {
      const index = cache.findIndex((i) => (i.uuid === e.uuid));

      if (index > -1) {
        cache[index] = e;
        return;
      }

      cache.push(e);
    });

    return Promise.resolve(entities);
  }

  public deleteOne(entity: Task): Promise<Task> {
    if (!entity) {
      return Promise.resolve(Task.null);
    }

    logger(`deleting task (id:=${JSON.stringify(entity.state)}) from persistent store ...`);

    const isMatch = (task: ITaskState): boolean => {
      return (task.uuid === entity.uuid);
    }

    const state = cache.find((t) => isMatch(t));

    const remove = (task: ITaskState): boolean => {
      return (!(isMatch(task)));
    }

    cache = cache.filter(remove);
    return Promise.resolve(Task.from(state));
  }

  public async delete(ids: (Task | Task[])): Promise<Task[]> {
    logger(`deleting tasks (id:=${JSON.stringify(ids)}) from persistent store ...`);

    if (!ids) {
      return [];
    }

    const deleted = (Array.isArray(ids) ? ids : [ids]);

    const remove = (task: ITaskState): boolean => {
      return (!Boolean(deleted.find((d) => (d.uuid === task.uuid))));
    }

    return Task.from(cache = cache.filter(remove));
  }
}
