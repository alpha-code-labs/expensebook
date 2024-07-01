import { Router } from "express";
import { getTravelExpenseData, paidExpenseReports,} from "../controller/travelExpenseController.js";

const expenseRouter = Router();

expenseRouter.get("/find/:tenantId" , getTravelExpenseData);

expenseRouter.put("/paid/:tenantId/:travelRequestId/:expenseHeaderId", paidExpenseReports)


export default expenseRouter;



