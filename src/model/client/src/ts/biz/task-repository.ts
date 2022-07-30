import { exec, RequestParams, GetRequestParams, HttpMethod } from '../shared/fetch-util';
import { Task, ITaskState, KV } from 'model-core';
export { Task, ITaskState };

const baseUrl = '/api/v1.0';
const url = `${baseUrl}/tasks`

export class TaskRepository {
  public async get(context: KV = null): Promise<Task[]> {
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

  public async post(entities: (Task | Task[])): Promise<Task[]> {
    return this.persist('POST', entities);
  }

  public async delete(entities:  (Task | Task[])): Promise<Task[]> {
    return this.persist('DELETE', entities);
  }

  private async persist(method: ('POST' | 'DELETE'), entities: (Task | Task[])): Promise<Task[]> {
    const body: ITaskState[] = (Array.isArray(entities) ? (entities.map((e) => e.state)) : [entities.state]);
    const response = (await exec(RequestParams.createModParams(method, url, body)));
    const json = (await response.value.json());

    return Task.from(json);
  }
}
