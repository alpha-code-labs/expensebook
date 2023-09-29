import express from 'express';
import { modifyTripDetails, saveTrip , processTrip } from "../controllers/modifyTripDetailsController.js";

const router = express.Router();

// POST route to modify trip details by trip ID
router.post('/modifyForm/:tripId', modifyTripDetails);

//Save trip after modification
router.post('/saveTrip', saveTrip);

//submit trip for validation after modification
router.post('/processTrip', processTrip);

export default router;