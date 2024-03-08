import express from "express";
import { employeeReport } from "../controller/reportingController.js";

export const reportingRouter = express.Router()

reportingRouter.get('/employee-report/:tenantId/:empId/:period', employeeReport);