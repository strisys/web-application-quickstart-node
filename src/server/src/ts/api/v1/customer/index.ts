import { Router } from 'express';
import { CustomerController } from './controller';

export const router = Router();
const controller = new CustomerController();

router.get(`/`, controller.get);
router.get(`/:id`, controller.getOne);
