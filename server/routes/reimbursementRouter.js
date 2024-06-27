import express from "express";
import { getReimbursement, paidNonTravelExpenseReports, settlementReimbursement, unSettlementReimbursement } from "../controller/reimbursementController.js";

const nonTravel = express.Router();

nonTravel.get("/find/:tenantId" , getReimbursement);

nonTravel.put("/paid/:tenantId/:expenseHeaderId", paidNonTravelExpenseReports)

nonTravel.put("/settlement" , settlementReimbursement);

nonTravel.put("/unSettlement" , unSettlementReimbursement);
export default nonTravel;






