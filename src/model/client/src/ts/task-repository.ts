import { fetch } from 'cross-fetch';
import { Task, ITaskState } from 'model-core';
export { Task, ITaskState };

const baseUrl = 'http://localhost:3000/api/v1.0';

export class TaskRepository {
  public async get(): Promise<Task[]> {
    const response = (await fetch(`${baseUrl}/tasks`));
    const json = (await response.json());

    return Task.from(json);
  }

  public async getOne(id: string): Promise<Task> {
    const entities = (await this.get());

    const state = entities.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Task(state)) : Task.null());
  }
}
