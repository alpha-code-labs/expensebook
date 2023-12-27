import express from 'express';
import {  dummyDataTrip} from '../controllers/tripController.js';
import { getTop3TripsByUserId ,getTripStatusByUserId  } from '../controllers/modifyTripController.js';
import { getSingleTripStatus } from '../controllers/modifyTripController.js';
import { upcomingTripById, transitTripById } from '../controllers/tripDetails.js';

const tripRoutes = express.Router();

// Create a new trip
tripRoutes.post('/create/:tenantId/:travelRequestId', dummyDataTrip);

//Upcoming trip details by id
tripRoutes.get('/upcomingTripById/:tripId', upcomingTripById);

//Transit trip details by id
tripRoutes.get('/transitTripById/:tripId', transitTripById);

//Top 3 trips for a user by userId
tripRoutes.get('/getTop3Trips/:userId', getTop3TripsByUserId);

// Get a list of all trips
tripRoutes.get('/getTripStatusByUserId/:userId', getTripStatusByUserId);

// GET route to retrieve trip status by trip ID
tripRoutes.get('/status/:tripId', getSingleTripStatus);

export default tripRoutes;
