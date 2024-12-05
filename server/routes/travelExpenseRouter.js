import { Router } from "express";
import {
  getTravelExpenseData,
  paidExpenseReports,
} from "../controller/travelExpenseController.js";
import { getAllEntries } from "../controller/settlingAccountingEntries.js";

const expenseRouter = Router();

expenseRouter.get("/find/:tenantId", getTravelExpenseData);

expenseRouter.patch(
  "/paid/:tenantId/:travelRequestId/:expenseHeaderId",
  paidExpenseReports
);

expenseRouter.post("/:tenantId/:empId", getAllEntries);

export default expenseRouter;
