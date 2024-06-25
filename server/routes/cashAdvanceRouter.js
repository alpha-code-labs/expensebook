import { Router } from "express";
import { getPaidAndCancelledCash, getCashAdvanceToSettle, settlement, unSettlement } from "../controller/cashAdvanceController.js";

const router = Router();

router.get("/cancelled/:tenantId" , getPaidAndCancelledCash);

router.get('/settle/:tenantId', getCashAdvanceToSettle)

router.put("/settlement/:tenantId/:travelRequestId/:cashAdvanceId" , settlement);

router.put("/unSettlement/:tenantId/:travelRequestId" , unSettlement);


export default router;











