import { Router } from 'express';
import { registerEmployee, setEmployeePassword } from '../controllers/EmployeeController';

const router = Router();

router.post('/', registerEmployee);
router.post('/set-password', setEmployeePassword);

export default router;
