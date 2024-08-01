import express from "express";
import {  approveAll, approveExpenseLines, approveExpenseReports,  approveTravelWithCash, nonTravelReportApproval, rejectAll, rejectExpenseLines, rejectExpenseReports,  rejectTravelWithCash, travelWithCashApproveCashAdvance, travelWithCashRejectCashAdvance } from "../controllers/approval.js";

export const approvalRouter = express.Router()

// approve travel Request with/without cash advance
approvalRouter.patch('/:tenantId/:empId/:travelRequestId/approve', approveTravelWithCash)

approvalRouter.patch('/:tenantId/:empId/reject/:travelRequestId', rejectTravelWithCash)

approvalRouter.patch('/:tenantId/:empId/approve', approveAll)

approvalRouter.patch('/:tenantId/:empId/reject',  rejectAll)

approvalRouter.patch('/:tenantId/:empId/approve/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance)

approvalRouter.patch('/:tenantId/:empId/reject/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance)

//Travel expense Reports
approvalRouter.patch('/:tenantId/:empId/approve/:tripId/:expenseHeaderId', approveExpenseReports)

approvalRouter.patch('/:tenantId/:empId/reject/:tripId/:expenseHeaderId', rejectExpenseReports)

approvalRouter.patch('/:tenantId/:empId/approve/line/:tripId/:expenseHeaderId',approveExpenseLines)

approvalRouter.patch('/:tenantId/:empId/reject/line/:tripId/:expenseHeaderId',rejectExpenseLines)

//Non Travel Expense Reports
approvalRouter.patch('/:tenantId/:empId/:expenseHeaderId', nonTravelReportApproval)




























// approvalRouter.patch('/:tenantId/:empId/approve/:expenseHeaderId', approveNonTravelExpenseReports)

// approvalRouter.patch('/:tenantId/:empId/reject/:expenseHeaderId', rejectNonTravelExpenseReports)

// approvalRouter.patch('/:tenantId/:empId/approve/line/:expenseHeaderId',approveNonTravelExpenseLines)




