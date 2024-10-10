import express from "express";
import { markMessageAsRead } from "../controllers/notificationController.js";

export const notificationRouter = express.Router()

notificationRouter.patch('/:tenantId/:empId/:travelRequestId/:notificationId',markMessageAsRead)