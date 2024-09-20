import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import router from './tripRoutes.js';
import { reimbursementRoutes } from './reimbursementRoute.js';

export const mainRouter = express.Router();

mainRouter.use("/api/v1/reporting/roles", roleBasedRouter);

mainRouter.use("/api/v1/reporting/trips", router)

mainRouter.use("/api/v1/reporting/non-travel-expenses", reimbursementRoutes)












