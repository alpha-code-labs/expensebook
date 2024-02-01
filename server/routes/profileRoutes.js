import express from 'express';
import { saveEmployeePreferencesController } from '../controllers/profileController.js';

export const profileRouter = express.Router();

profileRouter.post('/saveEmployeePreferences/:tenantId/:empId', saveEmployeePreferencesController);





