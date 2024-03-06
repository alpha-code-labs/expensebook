import express from 'express';
import { roleBasedRouter } from './roleBasedRoutes.js';

export const mainRouter = express.Router();

mainRouter.use("/role", roleBasedRouter);