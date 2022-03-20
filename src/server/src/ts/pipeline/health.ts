import { Application, Request, Response } from 'express';
import { getLogger } from 'model-server';
import { StatusCodes } from 'http-status-codes';
import process from 'process';
import os from 'os';

const logger = getLogger('heartbeat');

const toMBString = (bytes: number): string => {
  return `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`;
}

export const configure = (app: Application): Application => {
  app.get("/heartbeat", (_: Request, response: Response) => {
    logger('Checking heartbeat ...')
    response.status(StatusCodes.OK);
    response.send('ok');
  });

  app.get("/sys-info", async (_: Request, response: Response) => {
    let memoryUsed = process.memoryUsage();
        
    const info = {
        osMemory: {
           freemem: toMBString(os.freemem()), 
           totalmem:  toMBString(os.totalmem())
        }, 
        memoryUsage: {
          rss: toMBString(memoryUsed.rss),
          heapTotal: toMBString(memoryUsed.heapTotal),
          heapUsed: toMBString(memoryUsed.heapUsed),
          external: toMBString(memoryUsed.external),
          arrayBuffers: toMBString(memoryUsed.arrayBuffers),
        }, 
        cpus: os.cpus(),
        osType: os.type(),
        platform: os.platform(),
        // newtworkInterfaces: os.networkInterfaces()
    }; 

    response.status(StatusCodes.OK);
    response.jsonp(info);
  });

  return app;
}