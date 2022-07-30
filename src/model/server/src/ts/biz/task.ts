import { Task, ITaskState } from 'model-core';
export { Task, ITaskState };

// NOTE: This is data that would come from a document or relational database
let cache: ITaskState[] = [{
  id: '1',
  description: 'Refactor this app'
}, {
  id: '2',
  description: 'Watch YouTube'
}, {
  id: '3',
  description: 'Read About Frogs'
}, {
  id: '4',
  description: 'Call Mother'
}, {
  id: '5',
  description: 'Buy Groceries'
}, {
  id: '6',
  description: 'Bake Cake'
}];

export class TaskRepository {
  public async get(): Promise<Task[]> {
    return Task.from(cache);
  }

  public async getOne(id: string): Promise<Task> {
    const state = cache.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Task(state)) : Task.null());
  }

  public async delete(ids: (Task | Task[])): Promise<Task[]> {
    if (!ids) {
      return [];
    }

    const deleted = (Array.isArray(ids) ? ids : [ids]);

    const remove = (task: ITaskState): boolean => {
      return (!Boolean(deleted.find((d) => (d.id === task.id))));
    }

    return Task.from(cache = cache.filter(remove));
  }
}
