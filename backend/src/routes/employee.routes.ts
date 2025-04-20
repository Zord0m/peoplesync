import { Router } from 'express';
import { getEmployeeHandler, registerEmployee, setEmployeePassword, updateEmployeeHandler, updatePasswordHandler } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.post('/', registerEmployee);
router.post('/set-password', setEmployeePassword);

// Novas rotas
router.get('/:register',authMiddleware, isAdmin,  getEmployeeHandler); // Ver funcionário
router.put('/:register',authMiddleware, isAdmin, updateEmployeeHandler); // Editar funcionário
router.put('/:register/password',authMiddleware, updatePasswordHandler); // Editar senha

export default router;