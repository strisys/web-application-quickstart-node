import { getLogger as gl } from 'model-core';
import path from 'path';
import Module from "module";

process.env['IS_TEST_CONTEXT'] = 'true';

export const getLogger = (module: Module): debug.Debugger => {
  return gl(path.basename(module.filename));
}