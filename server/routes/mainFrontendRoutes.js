import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import router from './tripRoutes.js';
import { reimbursementRoutes } from './reimbursementRoute.js';

export const mainRouter = express.Router();

mainRouter.use("/role", roleBasedRouter);

mainRouter.use("/trips", router)

mainRouter.use("/reim", reimbursementRoutes)














