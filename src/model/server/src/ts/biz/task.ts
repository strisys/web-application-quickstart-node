import { Task, ITaskState, generateUuid, getLogger } from 'model-core';
import { SqlClient, TokenCredentialOrNull, toCredential } from '../shared/sql-data-access';

export { toCredential };
export type TaskRepositoryType = ('in-memory' | 'sql-server');
type TaskStateOmit = Omit<ITaskState, ('id' | 'uuid' | 'tags' | 'syncStatus')>;

const taskDescriptions = ['Refactor App', 'Read About Frogs', 'Call Friend', 'Buy Groceries', 'Bake Cake', 'Eat Cake', 'Watch YouTube'];

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

export interface ITaskRepository {
  get(): Promise<Task[]>;
  getOne(id: string): Promise<Task>;
  post(entities: Array<Task>): Promise<Array<Task>>;
  postOne(entity: Task): Promise<Task>;
  deleteOne(entity: Task): Promise<Task>;
  delete(ids: (Task | Task[])): Promise<Task[]>;
}

class TaskRepositoryInMemory implements ITaskRepository {
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

  public async postOne(entity: Task): Promise<Task> {
    if (!entity) {
      return Promise.resolve(Task.null);
    }

    try {
      const entities = (await this.post([entity]));
      return entities[0];
    }
    catch (error) {
      logger(`failed to post entity (${entity}). ${error}`);
      throw error;
    }
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

    const state = (cache.find((t) => isMatch(t)) || null);

    if (!state) {
      return Promise.resolve(Task.null);
    }

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

class TaskRepositorySql implements ITaskRepository {
  private readonly _client: SqlClient;

  public constructor(credential: TokenCredentialOrNull = null) {
    this._client = new SqlClient(credential);
  }

  private async query(sql: string): Promise<Array<Task>> {
    const toState = (row: any): ITaskState => {
      return {
        id: row.id,
        uuid: row.uuid,
        description: row.description,
        syncStatus: 'sychronized',
        tags: {}
      }
    }

    return Task.from((await this._client.queryAndMap<ITaskState>(sql, toState)));
  }

  public async get(): Promise<Array<Task>> {
    return (await this.query(`SELECT * FROM [waqs].[Task]`));
  }

  public async getOne(uuid: string): Promise<Task> {
    const entities = (await this.query(`SELECT * FROM [waqs].[Task] WHERE [uuid] = '${uuid}'`));
    return ((entities && entities.length) ? entities[0] : Task.null);
  }

  public async postOne(entity: Task): Promise<Task> {
    throw new Error(`not implemented`);
  }

  public post(entities: Array<Task>): Promise<Array<Task>> {
    throw new Error(`not implemented`);
  }

  public deleteOne(entity: Task): Promise<Task> {
    throw new Error(`not implemented`);
  }

  public async delete(ids: (Task | Task[])): Promise<Task[]> {
    throw new Error(`not implemented`);
  }
}

export class TaskRepositoryFactory {
  public static get(type: TaskRepositoryType, credential: TokenCredentialOrNull = null): ITaskRepository {
    if (type === 'in-memory') {
      return (new TaskRepositoryInMemory());
    }

    if (type === 'sql-server') {
      return (new TaskRepositorySql(credential));
    }

    throw new Error(`Failed to get 'ITaskRepository' implementation.  The specified type (${type}) is not supported.`)
  }
}