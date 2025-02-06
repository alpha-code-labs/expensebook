import { Router } from "express";
import { roleBasedLayout } from "../controller/financeController.js";
import cashAdvance from "./cashAdvanceRouter.js";
import expenseRouter from "./travelExpenseRouter.js";
import nonTravel from "./reimbursementRouter.js";

const router = Router();

router.get("/role/:tenantId/:empId", roleBasedLayout);

router.use("/cash", cashAdvance);

router.use("/expense", expenseRouter);

router.use("/nontravel", nonTravel);

export default router;
