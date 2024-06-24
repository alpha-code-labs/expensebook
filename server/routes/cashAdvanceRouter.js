import { Router } from "express";
import { getCashAdvanceData, settlement, unSettlement } from "../controller/cashAdvanceController.js";

const router = Router();

router.get("/find/:tenantId" , getCashAdvanceData);

router.put("/settlement/:tenantId/:travelRequestId/:cashAdvanceId" , settlement);

router.put("/unSettlement/:tenantId/:travelRequestId" , unSettlement);


export default router;











