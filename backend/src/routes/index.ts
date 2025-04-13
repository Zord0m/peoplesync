import { Router } from 'express';
import employeeRoutes from './employee.routes';
import authroutes from './auth.routes';
import createProject from './projectRoutes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/login', authroutes);
router.use('/projects', createProject); 

export default router;
