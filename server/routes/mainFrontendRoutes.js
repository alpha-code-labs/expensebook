import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import { travelAdminRoutes } from './travelAdmin.js';
import { profileRouter } from './profileRoutes.js';
import { approvalRouter } from './approval.js';
import bookingsRouter from './bookings.js';
import { verifyJwt } from '../middleware/jwt.middleware.js';


export const mainRouter = express.Router();

mainRouter.use(verifyJwt);

mainRouter.use("/role", roleBasedRouter);

mainRouter.use("/travel-admin", travelAdminRoutes)

mainRouter.use("/profile", profileRouter)

mainRouter.use("/approval",approvalRouter)

mainRouter.use("/bookings", bookingsRouter)