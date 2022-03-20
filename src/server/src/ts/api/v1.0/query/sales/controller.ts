import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { getLogger, SalesEntryQueryService } from 'model-server';

const logger = getLogger('sales-entry-controller')
const service = new SalesEntryQueryService();

export class Controller {
  public async get(req: Request, res: Response): Promise<void> {
    res.status(httpStatus.OK);

    logger('recieved request for all sales entry query result ...')

    const result = await service.get();

    if (result) {
      res.status(httpStatus.OK);
      res.jsonp(result.state);
      return;
    }

    res.status(httpStatus.NOT_FOUND);
    res.jsonp({});
  }
}