import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { TaskRepositoryFactory, Task, getLogger, ITaskState } from 'model-server';

const logger = getLogger('api:v1.0:task');
const repository = TaskRepositoryFactory.get('in-memory');

export class Controller {
  public async get(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request for all entities ...`);

    const entities = await repository.get();
    const state = entities.map((e) => e.state);

    res.status(httpStatus.OK).jsonp(state);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request for one entity (id:=${req.params.id}) ...`);
    const entity = await repository.getOne(req.params.id);

    if (entity) {
      res.status(httpStatus.OK).jsonp(entity.state);
      return;
    }

    res.status(httpStatus.NOT_FOUND).jsonp({});
  }

  public async post(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request (body: ${JSON.stringify(req.body)}) ...`);
    const states: Array<ITaskState> = req.body;

    if (!states) {
      res.status(httpStatus.BAD_REQUEST).jsonp({});
      return;
    }

    try {
      const result = ((await repository.post(Task.from(states))) || []);
      res.status(httpStatus.OK).jsonp(result.map((e) => e.state));
    }
    catch (e) {
      logger(`failed to persist entities (error:=${e})`);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp({});
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request for one entity (id:=${req.params.id}) ...`)
    const entity = (await repository.getOne(req.params.id));

    if (entity) {
      const result = (await repository.deleteOne(entity));

      if ((result) && (!result.isNull)) {
        logger(`deleted entity (id:=${req.params.id}) ...`);
        res.status(httpStatus.OK).jsonp(entity.state);
        return;
      }
    }

    logger(`delete failed.  entity not found. (id:=${req.params.id}) ...`)
    res.status(httpStatus.NOT_FOUND).jsonp({});
  }
}