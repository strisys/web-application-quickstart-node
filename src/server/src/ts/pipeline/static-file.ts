import express from 'express';
import path from 'path';
import { getLogger } from 'model-server';

const loggerFn = getLogger('static');

export const publicPath = path.join(__dirname, '../../../public');
loggerFn(`Public path mapped to: ${publicPath}`);

export const staticfile = express.static(publicPath);