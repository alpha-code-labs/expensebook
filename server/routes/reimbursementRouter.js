import express from "express";
import { getReimbursement, paidNonTravelExpenseReports,  } from "../controller/reimbursementController.js";
import { getNonTravelExpenseReports, updateAllNonTravelExpenseReports } from "../controller/settlingAccountingEntries.js";

const nonTravel = express.Router();

nonTravel.get("/find/:tenantId" , getReimbursement);

nonTravel.put("/paid/:tenantId/:expenseHeaderId", paidNonTravelExpenseReports)

nonTravel.post("/filter/:tenantId/:empId", getNonTravelExpenseReports)

nonTravel.post("/filter/update/:tenantId/:empId", updateAllNonTravelExpenseReports)

export default nonTravel;






