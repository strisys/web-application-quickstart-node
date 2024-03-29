import { Router } from 'express';
import { Controller } from './controller';

export const router = Router();
const controller = new Controller();

router.get(`/`, controller.get);
router.get(`/:id`, controller.getOne);
router.post(`/`, controller.post);
router.put(`/`, controller.post);
router.delete(`/:id`, controller.delete);