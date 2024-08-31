import express from "express";
import {  approveAll, nonTravelReportApproval, rejectAll,  travelExpenseApproval, travelWithCashApproveCashAdvance, travelWithCashRejectCashAdvance } from "../controllers/approval.js";

export const approvalRouter = express.Router()

approvalRouter.patch('/:tenantId/:empId/approve', approveAll)

approvalRouter.patch('/:tenantId/:empId/reject',  rejectAll)

approvalRouter.patch('/:tenantId/:empId/approve/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance)

approvalRouter.patch('/:tenantId/:empId/reject/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance)

//Travel expense Reports
approvalRouter.patch('/:tenantId/:empId/:tripId/:expenseHeaderId', travelExpenseApproval)

//Non Travel Expense Reports
approvalRouter.patch('/:tenantId/:empId/:expenseHeaderId', nonTravelReportApproval)




























// approvalRouter.patch('/:tenantId/:empId/approve/:expenseHeaderId', approveNonTravelExpenseReports)

// approvalRouter.patch('/:tenantId/:empId/reject/:expenseHeaderId', rejectNonTravelExpenseReports)

// approvalRouter.patch('/:tenantId/:empId/approve/line/:expenseHeaderId',approveNonTravelExpenseLines)




