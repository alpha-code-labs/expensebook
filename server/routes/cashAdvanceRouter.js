import { Router } from "express";
import { getPaidAndCancelledCash, getCashAdvanceToSettle, recoverCashAdvance, paidCashAdvance } from "../controller/cashAdvanceController.js";

const cashAdvance = Router();

cashAdvance.get("/cancelled/:tenantId" , getPaidAndCancelledCash);

cashAdvance.get('/settle/:tenantId', getCashAdvanceToSettle)

cashAdvance.put('/recovery/:tenantId/:travelRequestId/:cashAdvanceId', recoverCashAdvance)

cashAdvance.put("/paid/:tenantId/:travelRequestId/:cashAdvanceId" , paidCashAdvance);

export default cashAdvance;











