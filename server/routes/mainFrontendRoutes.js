import express from 'express';
import oldTripRoutes from './tripsRoutes.js';

const mainFrontendRoutes = express.Router();


mainFrontendRoutes.use('/:tenantId/:empId/tripold', oldTripRoutes);

export default mainFrontendRoutes;


