import { Router } from 'express';
import { getEmployeeHandler, registerEmployee, setEmployeePassword, updateEmployeeHandler, updatePasswordHandler } from '../controllers/EmployeeController';

const router = Router();

router.post('/', registerEmployee);
router.post('/set-password', setEmployeePassword);

// Novas rotas
router.get('/:register', getEmployeeHandler); // Ver funcionário
router.put('/:register', updateEmployeeHandler); // Editar funcionário
router.put('/:register/password', updatePasswordHandler); // Editar senha

export default router;
