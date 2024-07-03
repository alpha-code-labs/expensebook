import { Router } from "express";
import { getTravelExpenseData, paidExpenseReports,} from "../controller/travelExpenseController.js";
import { getTravelExpenseReports } from "../controller/settlingAccountingEntries.js";

const expenseRouter = Router();

expenseRouter.get("/find/:tenantId" , getTravelExpenseData);

expenseRouter.put("/paid/:tenantId/:travelRequestId/:expenseHeaderId", paidExpenseReports)

expenseRouter.post("/filter/:tenantId/:empId", getTravelExpenseReports)

export default expenseRouter;



