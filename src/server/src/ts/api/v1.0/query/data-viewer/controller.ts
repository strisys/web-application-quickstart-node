import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { getLogger, ReportEntryRepository } from 'model-server';

const logger = getLogger('api:v1.0:data-viewer');
const repository = new ReportEntryRepository();

export class Controller {
  public async post(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request ...`);

    const report = req.params.report;
    const version = req.params.version;
    const data = req.body;

    try {
      const result = (await repository.post(report, version, data)).toString();
      res.status(httpStatus.OK).jsonp(result);
    }
    catch (e) {
      logger(`failed to persist data (error:=${e})`);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp({ error: JSON.stringify(e) });
    }
  }

  public async get(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request ...`);

    const report = req.params.report;
    const version = req.params.version;

    try {
      const result = (await repository.get(report, version));
      res.status(httpStatus.OK).jsonp(result.state);
    }
    catch (e) {
      logger(`failed to persist data (error:=${e})`);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp({ error: JSON.stringify(e) });
    }
  }

  public async getDetails(req: Request, res: Response): Promise<void> {
    logger(`recieved ${req.method} request ...`);

    try {
      const result = (await repository.getAllDetails());
      res.status(httpStatus.OK).jsonp(result);
    }
    catch (e) {
      logger(`failed to persist data (error:=${e})`);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).jsonp({ error: JSON.stringify(e) });
    }
  }
}