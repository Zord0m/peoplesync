import { Router } from 'express';
import { registerEmployee } from '../controllers/EmployeeController';

const router = Router();

router.post('/', registerEmployee);

export default router;
