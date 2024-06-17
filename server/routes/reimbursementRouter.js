import express from "express";
import { getReimbursement, settlementReimbursement, unSettlementReimbursement } from "../controller/reimbursementController.js";

const router = express.Router();
 
router.get("/find/:tenantId" , getReimbursement);
router.put("/settlement" , settlementReimbursement);
router.put("/unSettlement" , unSettlementReimbursement);
export default router;






