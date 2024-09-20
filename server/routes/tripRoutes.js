import express from 'express';
import { filterTrips } from '../controllers/tripController.js';
import { getTrips } from '../roleBasedReporting/reportingController.js';

const router = express.Router();

router.post('/filter/:tenantId/:empId', filterTrips);

router.get('/trips/:tenantId/:empId', getTrips)

export default router;




