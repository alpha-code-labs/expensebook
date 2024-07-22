import express from 'express';
import { cancelTripAtHeaderLevel, cancelTripAtLineItemLevel, getTripDetails } from '../controllers/cancelTripController.js';
import { recoveryAtHeaderLevel, recoveryAtLineItemLevel } from '../controllers/recoveryFlow.js';
import { addALeg } from '../controllers/addALeg.js';
import { getHrData, modifyTrip } from '../controllers/modifyTrips.js';

const tripRoutes = express.Router();

// - Requirement - Cancellation workflow for Trips
// Get trip details by trip Id -- row 16 - category 10 & Trip Microservice -Travel recovery flow for paid and cancelled Trips - 51 - category 10
tripRoutes.get('/:tenantId/:empId/:travelType', getHrData )

tripRoutes.get('/:tenantId/:empId/:tripId/trip', getTripDetails);

tripRoutes.post('/:tenantId/:empId/:tripId/modify', modifyTrip)

// cancel at header level - upcoming trips only-- row 30 - category 4
tripRoutes.patch('/:tenantId/:empId/:tripId/cancel', cancelTripAtHeaderLevel);

// cancel at Line item level - upcoming/transit trips only -- row 43 - category 4
tripRoutes.patch('/:tenantId/:empId/:tripId/cancel-line', cancelTripAtLineItemLevel);

// recovery for entire trip
tripRoutes.patch('/:tenantId/:empId/:tripId/recover', recoveryAtHeaderLevel);

// recovery for line item
tripRoutes.patch('/:tenantId/:empId/:tripId/recover-line', recoveryAtLineItemLevel);


export default tripRoutes;
