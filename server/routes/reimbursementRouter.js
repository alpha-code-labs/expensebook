import express from "express";
import { getReimbursement, paidNonTravelExpenseReports, settlementReimbursement, unSettlementReimbursement } from "../controller/reimbursementController.js";

const router = express.Router();

router.get("/find/:tenantId" , getReimbursement);

router.put("/paid/:tenantId/:expenseHeaderId", paidNonTravelExpenseReports)

router.put("/settlement" , settlementReimbursement);
router.put("/unSettlement" , unSettlementReimbursement);
export default router;






