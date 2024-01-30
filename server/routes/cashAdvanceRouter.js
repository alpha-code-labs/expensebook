import { Router } from "express";
const router = Router();
 
import { getCashAdvanceData, settlement, unSettlement } from "../controller/cashAdvanceController.js";
router.get("/find" , getCashAdvanceData);

router.put("/settlement/:tenantId/:travelRequestId" , settlement);

router.put("/unSettlement/:tenantId/:travelRequestId" , unSettlement);


export default router;



