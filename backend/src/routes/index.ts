import { Router } from 'express';
import employeeRoutes from './employee.routes';
import authroutes from './auth.routes';
import createProject from './projectRoutes';
import timeRecordRoutes from './timeRecord.routes';


const router = Router();

router.use('/employees', employeeRoutes);
router.use('/auth', authroutes);
router.use('/projects', createProject); 
router.use('/time-record', timeRecordRoutes);

export default router;
