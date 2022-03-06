import { Task, ITaskState } from 'model-core';
export { Task, ITaskState };

// NOTE: This is data that would come from a document or relational database
const data: ITaskState[] = [{
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
    return Task.from(data);
  }

  public async getOne(id: string): Promise<Task> {
    const state = data.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Task(state)) : Task.null());
  }
}
