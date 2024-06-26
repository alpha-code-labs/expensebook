import { Router } from "express";
import { getTravelExpenseData, paidExpenseReports, settlementTravelExpenseData, unSettlementTravelExpenseData } from "../controller/travelExpenseController.js";

const expenseRouter = Router();

expenseRouter.get("/find/:tenantId" , getTravelExpenseData);

expenseRouter.put("/paid/:tenantId/:travelRequestId/:expenseHeaderId", paidExpenseReports)

expenseRouter.put("/settlement" , settlementTravelExpenseData);

expenseRouter.put("/unSettlement" , unSettlementTravelExpenseData);

export default expenseRouter;



