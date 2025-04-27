import { Router } from 'express';
import { getEmployeeHandler, getEmployeesHandler, registerEmployee, setEmployeePassword, updateEmployeeHandler, updatePasswordHandler } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { isActiveMiddleware } from '../middlewares/isActive';

const router = Router();

router.post('/',authMiddleware, isAdmin, registerEmployee);
router.post('/set-password', setEmployeePassword);

// Novas rotas
router.get('/:register',authMiddleware, isAdmin,  getEmployeeHandler); // Ver funcionário
router.get('/', authMiddleware, isAdmin, getEmployeesHandler); // Ver vários funcionários
router.put('/:register',authMiddleware, isAdmin, updateEmployeeHandler); // Editar funcionário
router.put('/:register/password',authMiddleware, updatePasswordHandler); // Editar senha

export default router;