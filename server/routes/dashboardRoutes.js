import  express  from "express";
import { upcomingTripsByUserId, transitTripsByUserId, allTripsByUserId } from "../controllers/dashboardDisplay.js";
const router = express.Router();

//All upcoming trips for a user
router.get('/upcoming/:userId', upcomingTripsByUserId);

//All transit trips for a user 
router.get('/transit/:userId',transitTripsByUserId);

//All trips for a user by tripStartDate
router.get('/all/:userId',allTripsByUserId);


export default router