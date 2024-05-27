import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';
import router from './tripRoutes.js';

export const mainRouter = express.Router();

mainRouter.use("/role", roleBasedRouter);

mainRouter.use("/filter", router)