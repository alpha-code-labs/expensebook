import express  from "express";
import { getTravelRequestDetails, getTravelRequestsAndCashAdvancesByApprovalId } from "../controllers/travelApproval.js";

const router = express.Router();

// GET route to getPendingApprovalRequests by trip ID
router.get("/:empId", getTravelRequestsAndCashAdvancesByApprovalId);

router.get('/td/:travelRequestId', getTravelRequestDetails);

export default router






