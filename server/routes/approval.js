import express from "express";
import { approveAll, approveExpenseLines, approveExpenseReports, approveNonTravelExpenseLines, approveNonTravelExpenseReports, approveTravelWithCash, rejectAllTravelWithCash, rejectExpenseLines, rejectExpenseReports, rejectNonTravelExpenseLines, rejectNonTravelExpenseReports, rejectTravelWithCash, travelWithCashApproveCashAdvance, travelWithCashRejectCashAdvance } from "../controllers/approval.js";

export const approvalRouter = express.Router()

approvalRouter.patch('/approve/:travelRequestId', approveTravelWithCash)

approvalRouter.patch('/reject/:travelRequestId', rejectTravelWithCash)

approvalRouter.patch('/approve', approveAll)

approvalRouter.patch('/reject', rejectAllTravelWithCash)

approvalRouter.patch('/approve/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance)

approvalRouter.patch('/reject/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance)

approvalRouter.patch('/approve/:tripId/:expenseHeaderId', approveExpenseReports)

approvalRouter.patch('/reject/:tripId/:expenseHeaderId', rejectExpenseReports)

approvalRouter.patch('/approve/line/:tripId/:expenseHeaderId',approveExpenseLines)

approvalRouter.patch('/reject/line/:tripId/:expenseHeaderId',rejectExpenseLines)

approvalRouter.patch('/approve/:expenseHeaderId', approveNonTravelExpenseReports)

approvalRouter.patch('/reject/:expenseHeaderId', rejectNonTravelExpenseReports)

approvalRouter.patch('/approve/line/:expenseHeaderId',approveNonTravelExpenseLines)

approvalRouter.patch('/reject/line/:expenseHeaderId', rejectNonTravelExpenseLines)







