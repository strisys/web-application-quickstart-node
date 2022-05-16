import express, { Request } from 'express';
import path from 'path';
import { getLogger } from 'model-server';

const loggerFn = getLogger('reroute');

const folders = [
  '/css/', 'css/icons/', '/css/devexpress/', '/css/devexpress/21.2/', '/css/devexpress/21.2/icons', '/img/background/', '/js/', , '/.well-known/'
]

const tryGetFolder = (req: Request): string => {
  const path = (req.path || '');
  
  return (folders.find((value) => {
    return path.includes(value);
  }) || null);
}

export const reroute = (staticPath: string): express.RequestHandler => {
  return (req, res) => {
    const folder = tryGetFolder(req);
    
    if (!folder) {
      loggerFn(`${req.path} ---> /`);
      return res.sendFile(staticPath + '/index.html');
    }
  
    const filename = path.basename(req.path);
    const segment = path.join(folder, filename);
    
    loggerFn(`${req.path} ---> ${segment}`);

    res.sendFile(path.join(staticPath, segment));
  }
}
