import { Router } from 'express';
import { Controller } from './controller';

export const router = Router();
const controller = new Controller();

router.get(`/:report/:version`, controller.get);
router.get(`/details`, controller.getDetails);
router.post(`/:report/:version`, controller.post);
router.put(`/:report/:version`, controller.post);