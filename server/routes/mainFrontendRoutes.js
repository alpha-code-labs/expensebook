import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import { travelAdminRoutes } from './travelAdmin.js';

export const mainRouter = express.Router();

mainRouter.use("/role", roleBasedRouter);

mainRouter.use("/travel-admin", travelAdminRoutes)