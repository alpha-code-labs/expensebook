import express from 'express';
import oldTripRoutes from './tripsRoutes.js';
import tripRoutes from './tripRoutes.js';

const mainFrontendRoutes = express.Router();

mainFrontendRoutes.use('/:tenantId/:empId', tripRoutes);

mainFrontendRoutes.use('/:tenantId/:empId/tripold', oldTripRoutes);

export default mainFrontendRoutes;