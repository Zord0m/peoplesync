import { Router } from 'express';
<<<<<<< HEAD
import { getEmployeeHandler, getPublicCommonEmployeeHandler, registerEmployee, setEmployeePassword, updateEmployeeHandler, updatePasswordHandler } from '../controllers/EmployeeController';
=======
import { getEmployeeHandler, getEmployeesHandler, registerEmployee, setEmployeePassword, updateEmployeeHandler, updatePasswordHandler, getPublicCommonEmployeeHandler } from '../controllers/EmployeeController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { isActiveMiddleware } from '../middlewares/isActive';
>>>>>>> bd2d053ff93c3844b6f9cc7993de2d0215f4e81e

const router = Router();

router.post('/',authMiddleware, isAdmin, registerEmployee);
router.post('/set-password', setEmployeePassword);

// Novas rotas
<<<<<<< HEAD
router.get('/public/employee/:register', getPublicCommonEmployeeHandler); // Ver funcionário comum
router.get('/:register', getEmployeeHandler); // Ver funcionário
router.put('/:register', updateEmployeeHandler); // Editar funcionário
router.put('/:register/password', updatePasswordHandler); // Editar senha
=======
router.get('/public/:register', getPublicCommonEmployeeHandler); // Ver funcionário comum
router.get('/:register',authMiddleware, isAdmin,  getEmployeeHandler); // Ver funcionário
router.get('/', authMiddleware, isAdmin, getEmployeesHandler); // Ver vários funcionários
router.put('/:register',authMiddleware, isAdmin, updateEmployeeHandler); // Editar funcionário
router.put('/:register/password',authMiddleware, updatePasswordHandler); // Editar senha
>>>>>>> bd2d053ff93c3844b6f9cc7993de2d0215f4e81e

export default router;