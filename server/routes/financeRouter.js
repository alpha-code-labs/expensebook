import { Router } from "express";
import { financeController } from "../controller/financeController.js";
const router = Router();

router.post("/post" , financeController);
export default router;