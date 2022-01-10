import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { CustomerRepository, Customer } from 'model-server';

export class CustomerController {
  public get(req: Request, res: Response): void {
    res.status(httpStatus.OK);

    const entities = (new CustomerRepository()).get();
    const state = entities.map((e: Customer) => e.state);

    res.jsonp(state);
  }

  public getOne(req: Request, res: Response): void {
    const entity = (new CustomerRepository()).getOne(req.params.id);

    if (entity) {
      res.status(httpStatus.OK);
      res.jsonp(entity.state);
      return;
    }

    res.status(httpStatus.NOT_FOUND);
    res.jsonp({});
  }
}