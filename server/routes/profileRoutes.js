import express from 'express';
import { getProfile, saveProfile } from '../controllers/profileController.js';

export const profileRouter = express.Router();

profileRouter.get('/:tenantId/:empId', getProfile);

profileRouter.post('/:tenantId/:empId', saveProfile);




