import { Router } from 'express';
import employeeRoutes from './employee.routes';
import authroutes from './auth.routes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/login', authroutes);

export default router;
