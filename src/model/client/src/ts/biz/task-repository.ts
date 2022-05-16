import { exec, GetRequestParams } from '../shared/fetch-util';
import { Task, ITaskState, KV } from 'model-core';
export { Task, ITaskState };

const baseUrl = '/api/v1.0';

export class TaskRepository {
  public async get(context: KV = null): Promise<Task[]> {
    const url = `${baseUrl}/tasks`
    const response = (await exec(new GetRequestParams(url, context)));
    const json = (await response.value.json());

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
