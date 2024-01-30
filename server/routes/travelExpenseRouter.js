import { Router } from "express";
const router = Router();
import { getTravelExpenseData, settlementTravelExpenseData, unSettlementTravelExpenseData } from "../controller/travelExpenseController.js";
 

router.get("/find" , getTravelExpenseData);

router.put("/settlement" , settlementTravelExpenseData);

router.put("/unSettlement" , unSettlementTravelExpenseData);

export default router;