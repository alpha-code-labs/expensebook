import express from 'express';
import { saveToEmbeddedTrip } from '../controllers/dummyController.js';

const dummy = express.Router();

// add a line item in trip 
dummy.post('/tripdata/:tenantId/:tenantName/:companyName/:travelRequestId', saveToEmbeddedTrip);



export default dummy;