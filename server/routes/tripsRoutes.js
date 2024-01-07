import express from 'express';
import {  dummyDataTrip} from '../controllers/tripController.js';

const oldTripRoutes = express.Router();

// Create a new trip
oldTripRoutes.post('/create/:tenantId/:travelRequestId', dummyDataTrip);


export default oldTripRoutes;
