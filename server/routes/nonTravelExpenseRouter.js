import express from "express";
import { getNonTravelExpenseData, settlementNonTravelExpenseData, unSettlementNonTravelExpenseData } from "../controller/nonTravelExpenseController.js";

const router = express.Router();
 
router.get("/find" , getNonTravelExpenseData);
router.put("/settlement" , settlementNonTravelExpenseData);

router.put("/unSettlement" , unSettlementNonTravelExpenseData);
export default router;