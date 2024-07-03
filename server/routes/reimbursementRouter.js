import express from "express";
import { getReimbursement, paidNonTravelExpenseReports, settlementReimbursement, unSettlementReimbursement } from "../controller/reimbursementController.js";
import { getNonTravelExpenseReport, updateAllNonTravelExpenseReports } from "../controller/settlingAccountingEntries.js";

const nonTravel = express.Router();

nonTravel.get("/find/:tenantId" , getReimbursement);

nonTravel.put("/paid/:tenantId/:expenseHeaderId", paidNonTravelExpenseReports)

nonTravel.post("/filter/:tenantId/:empId", getNonTravelExpenseReport)

nonTravel.post("/filter/update/:tenantId/:empId", updateAllNonTravelExpenseReports)

nonTravel.put("/settlement" , settlementReimbursement);

nonTravel.put("/unSettlement" , unSettlementReimbursement);
export default nonTravel;






