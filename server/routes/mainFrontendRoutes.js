import express from 'express';
import recoveryFlowRoutes from "./recoveryFlowRoutes.js";
import tripRoutes from "./tripRoutes.js";
import cancelTripRouter from './cancelTripRoutes.js';

const mainFrontendRoutes = express.Router();

mainFrontendRoutes.use('/trip', tripRoutes);

mainFrontendRoutes.use('/cancel', cancelTripRouter);

mainFrontendRoutes.use('/recovery', recoveryFlowRoutes)

export default mainFrontendRoutes;