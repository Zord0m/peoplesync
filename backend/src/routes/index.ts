import { Router } from 'express';
import employeeRoutes from './employee.routes';
import authroutes from './auth.routes';
import createProject from './projectRoutes';
import timeEntryRoutes from "./timeEntry.routes";


const router = Router();

router.use('/employees', employeeRoutes);
router.use('/auth', authroutes);
router.use('/projects', createProject); 
router.use("/time-entry", timeEntryRoutes);

export default router;
