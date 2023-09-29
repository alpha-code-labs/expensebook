import express from 'express';
import { createTrip} from '../controllers/tripController.js';
import { getTop3TripsByUserId ,getTripStatusByUserId  } from '../controllers/modifyTripController.js';
import { modifyTrip } from '../controllers/otherModifyTrip.js';
import { getSingleTripStatus } from '../controllers/modifyTripController.js';
import { upcomingTripById, transitTripById } from '../controllers/tripDetails.js';

const router = express.Router();

// Create a new trip
router.post('/create', createTrip);

//Upcoming trip details by id
router.get('/upcomingTripById/:tripId', upcomingTripById);

//Transit trip details by id
router.get('/transitTripById/:tripId', transitTripById);

//Top 3 trips for a user by userId
router.get('/getTop3Trips/:userId', getTop3TripsByUserId);

// Get a list of all trips
router.get('/getTripStatusByUserId/:userId', getTripStatusByUserId);

// GET route to retrieve trip status by trip ID
router.get('/status/:tripId', getSingleTripStatus);

//
router.post('/modify/:tripId', modifyTrip);



export default router;
