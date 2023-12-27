import express from 'express';
import { cancelTripAtHeaderLevel, cancelTripAtLineItemLevel, getTripDetails } from '../controllers/cancelTripController.js';

const cancelTripRouter = express.Router();

// - Requirement - Cancellation workflow for Trips

// Get trip details by trip ID -- row 16 - category 10 & Trip Microservice -Travel recovery flow for paid and cancelled Trips - 51 - category 10
cancelTripRouter.get('/details/:tenantId/:empId/:tripId', getTripDetails);

// cancel at header level - upcoming trips only-- row 30 - category 4
cancelTripRouter.patch('/header/:tenantId/:empId/:tripId', cancelTripAtHeaderLevel);

// cancel at Line item level - upcoming/transit trips only -- row 43 - category 4
cancelTripRouter.patch('/lineitem/:tenantId/:empId/:tripId', cancelTripAtLineItemLevel);

export default cancelTripRouter;
