import { getApiPath, HttpMethodPersist, RequestParams, exec, tryExecGetJson } from '../shared';
import { Task, ITaskState, KV, getLogger } from 'model-core';

const logger = getLogger('model.client:biz:task');
const apiPath = getApiPath('tasks');

export class TaskRepository {
  public async get(context: KV = {}): Promise<Task[]> {
    logger(`executing client call (ur:=${apiPath}) to query task(s) ...`);
    const states: Array<ITaskState> = (await tryExecGetJson(apiPath, context))
    return Task.from(states);
  }

  public async getOne(id: string): Promise<Task> {
    logger(`executing client call (url:=${getApiPath('tasks')}) to get one task ...`);
    const entities = (await this.get());

    // TODO: Move to server
    const state = entities.find((c) => (c.id === id));
    return ((state) ? (new Task(state)) : Task.null);
  }

  public async post(entities: (Task | Task[])): Promise<Task[]> {
    return this.persist('POST', entities);
  }

  public async delete(entities: (Task | Task[])): Promise<Task[]> {
    return this.persist('DELETE', entities);
  }

  public async deleteOne(entity: Task): Promise<Task> {
    if (!entity) {
      return entity;
    }

    const path = `${apiPath}/${entity.uuid}`;
    logger(`executing client call (url:=${path}) to persist task ...`);


    const response = (await exec(RequestParams.createModParams('DELETE', path)));
    logger(`client call (url:=${path}) to persist task ${response.value.status}`);

    return entity;
  }

  private async persist(method: HttpMethodPersist, entities: (Task | Task[])): Promise<Task[]> {
    logger(`executing client call (url:=${apiPath}) to persist tasks ...`);

    const body: ITaskState[] = (Array.isArray(entities) ? (entities.map((e) => e.state)) : [entities.state]);
    const response = (await exec(RequestParams.createModParams(method, apiPath, body)));
    const json: Array<ITaskState> = (await response.value.json());

    return Task.from(json);
  }
}
