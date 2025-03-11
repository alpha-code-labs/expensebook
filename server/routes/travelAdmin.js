import express from 'express';
import { assignedToTravelAdmin } from '../controllers/travelAdminController.js';

export const travelAdminRoutes = express.Router();

travelAdminRoutes.patch("/:tenantId/:travelRequestId", assignedToTravelAdmin);