import { Request, Response } from 'express';
import { getLogger } from 'model-server';
import httpStatus from 'http-status-codes';
import { TaskRepository, Task } from 'model-server';

const logger = getLogger('customer-controller')
const repository = new TaskRepository();

export class Controller {
  public async get(req: Request, res: Response): Promise<void> {
    res.status(httpStatus.OK);

    logger('recieved request for all entities ...')

    const entities = await repository.get();
    const state = entities.map((e: Task) => e.state);

    res.jsonp(state);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    logger(`recieved request for one entity (id:=${req.params.id}) ...`)
    const entity = await repository.getOne(req.params.id);

    if (entity) {
      res.status(httpStatus.OK);
      res.jsonp(entity.state);
      return;
    }

    res.status(httpStatus.NOT_FOUND);
    res.jsonp({});
  }

  public async delete(req: Request, res: Response): Promise<void> {
    logger(`recieved DELETE request for one entity (id:=${req.params.id}) ...`)
    const entity = (await repository.getOne(req.params.id));

    if (entity) {
      await repository.delete(entity);
      logger(`deleted one entity (id:=${req.params.id}) ...`)

      res.status(httpStatus.OK);
      res.jsonp(entity.state);
      return;
    }

    logger(`delete failed.  entity not found. (id:=${req.params.id}) ...`)
    res.status(httpStatus.NOT_FOUND);
    res.jsonp({});
  }
}