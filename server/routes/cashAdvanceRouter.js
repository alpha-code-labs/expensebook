import { Router } from "express";
import { getPaidAndCancelledCash, getCashAdvanceToSettle, recoverCashAdvance, paidCashAdvance } from "../controller/cashAdvanceController.js";

const router = Router();

router.get("/cancelled/:tenantId" , getPaidAndCancelledCash);

router.get('/settle/:tenantId', getCashAdvanceToSettle)

router.put('/recovery/:tenantId/:travelRequestId/:cashAdvanceId', recoverCashAdvance)

router.put("/paid/:tenantId/:travelRequestId/:cashAdvanceId" , paidCashAdvance);

export default router;











