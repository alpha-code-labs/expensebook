import { Router } from "express";
import Finance from "../models/Finance.js";
import { finnanceController } from "../controller/financeController.js";
const router = Router();

router.post("/post" , finnanceController);
export default router;