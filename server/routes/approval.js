import express from "express";
import { approveAllTravelWithCash, approveTravelWithCash, rejectTravelWithCash, travelWithCashApproveCashAdvance, travelWithCashRejectCashAdvance } from "../controllers/approval.js";

export const approvalRouter = express.Router()

approvalRouter.patch('/approve/:tenantId/:empId/:travelRequestId', approveTravelWithCash)

approvalRouter.patch('/reject/:tenantId/:empId/:travelRequestId', rejectTravelWithCash)

approvalRouter.patch('/approve/:tenantId/:empId', approveAllTravelWithCash)

approvalRouter.patch('/approve/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashApproveCashAdvance)

approvalRouter.patch('/reject/:tenantId/:empId/:travelRequestId/:cashAdvanceId', travelWithCashRejectCashAdvance)

