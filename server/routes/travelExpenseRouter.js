import { Router } from "express";
import { getTravelExpenseData, settlementTravelExpenseData, unSettlementTravelExpenseData } from "../controller/travelExpenseController.js";

const expenseRouter = Router();

expenseRouter.get("/find/:tenantId" , getTravelExpenseData);

expenseRouter.put("/settlement" , settlementTravelExpenseData);

expenseRouter.put("/unSettlement" , unSettlementTravelExpenseData);

export default expenseRouter;



