import { Router } from "express";
const router = Router();
 
import { getCashAdvanceData, settlement, unSettlement } from "../controller/cashAdvanceController.js";
router.get("/find" , getCashAdvanceData);

router.put("/settlement" , settlement);

router.put("/unSettlement" , unSettlement);


export default router;



