import express from 'express';
import { getTripDetails } from "../controllers/cancelTripController.js";
import { recoveryAtHeaderLevel, recoveryAtLineItemLevel } from '../controllers/recoveryFlow.js';

//Trip Microservice -Travel recovery flow for paid and cancelled Trips - 51 - category 10
const recoveryFlowRoutes = express.Router();

recoveryFlowRoutes.get('/details/:tenantId/:empId/:tripId', getTripDetails);

recoveryFlowRoutes.patch('/header/:tenantId/:empId/:tripId', recoveryAtHeaderLevel);

recoveryFlowRoutes.patch('/lineItem/:tenantId/:empId/:tripId', recoveryAtLineItemLevel);


export default recoveryFlowRoutes;