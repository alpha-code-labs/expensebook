import express from 'express';
import { cancelTripAtHeaderLevel, cancelTripAtLineItemLevel, getTripDetails } from '../controllers/cancelTripController.js';
import { recoveryAtHeaderLevel, recoveryAtLineItemLevel } from '../controllers/recoveryFlow.js';

const tripRoutes = express.Router();

// - Requirement - Cancellation workflow for Trips
// Get trip details by trip Id -- row 16 - category 10 & Trip Microservice -Travel recovery flow for paid and cancelled Trips - 51 - category 10
tripRoutes.get('/get/:tripId', getTripDetails);

// cancel at header level - upcoming trips only-- row 30 - category 4
tripRoutes.patch('/cancel/:tripId', cancelTripAtHeaderLevel);

// cancel at Line item level - upcoming/transit trips only -- row 43 - category 4
tripRoutes.patch('/cancel-itinerary/:tripId', cancelTripAtLineItemLevel);

// recovery trips
tripRoutes.get('/details/:tenantId/:empId/:tripId', getTripDetails);

// recovery for entire trip
tripRoutes.patch('/recover/:tripId', recoveryAtHeaderLevel);

// recovery for line item
tripRoutes.patch('/recover-itinerary/:tenantId/:empId/:tripId', recoveryAtLineItemLevel);

export default tripRoutes;
