import express from 'express';
import { updateAddLegToTrip } from '../controllers/dashboardMicroservice.js';

const internalDashboardRoute = express.Router();

internalDashboardRoute.post('/addleg', updateAddLegToTrip);

export default internalDashboardRoute;
