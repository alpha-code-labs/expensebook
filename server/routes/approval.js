import express from "express";
import { approveAllTravelWithCash, approveExpenseReports, approveNonTravelExpenseReports, approveTravelWithCash, rejectExpenseReports, rejectNonTravelExpenseReports, rejectTravelWithCash, travelWithCashApproveCashAdvance, travelWithCashRejectCashAdvance } from "../controllers/approval.js";

export const approvalRouter = express.Router()

approvalRouter.patch('/approve/:travelRequestId', approveTravelWithCash)

approvalRouter.patch('/reject/:travelRequestId', rejectTravelWithCash)

approvalRouter.patch('/approve', approveAllTravelWithCash)

approvalRouter.patch('/approve/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance)

approvalRouter.patch('/reject/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance)

approvalRouter.patch('/approve/:tripId/:expenseHeaderId', approveExpenseReports)

approvalRouter.patch('/reject/:tripId/:expenseHeaderId', rejectExpenseReports)

approvalRouter.patch('/approve/:expenseHeaderId', approveNonTravelExpenseReports)

approvalRouter.patch('/reject/:expenseHeaderId', rejectNonTravelExpenseReports)

