import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import router from './tripRoutes.js';
import { reimbursementRoutes } from './reimbursementRoute.js';
import { travelExpensesRouter } from './travelExpensesRoutes.js';
import { verifyJwt } from '../middleware/jwt.middleware.js';

export const mainRouter = express.Router();

mainRouter.use(verifyJwt)

mainRouter.use("/api/v1/reporting/roles", roleBasedRouter);

mainRouter.use("/api/v1/reporting/trips", router)

mainRouter.use("/api/v1/reporting/travel-expenses", travelExpensesRouter)

mainRouter.use("/api/v1/reporting/non-travel-expenses", reimbursementRoutes)












