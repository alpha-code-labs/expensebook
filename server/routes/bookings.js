import express, { Router } from "express";
import { recoveryAtLineItemLevel } from "../controllers/bookingAdmin.js";

const bookingsRouter = Router()

bookingsRouter.patch("/:tenantId/:empId/:tripId", recoveryAtLineItemLevel)



export default bookingsRouter