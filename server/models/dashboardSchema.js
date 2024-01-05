import mongoose from "mongoose";
// import { expenseSchema } from './expenseSchema.js';
import { travelRequestSchema } from "./travelSchema.js";
import { tripSchema } from "./tripSchema.js";
import { nonTravelExpenseSchema } from "./nonTravelExpenseSchema.js";
import { cashAdvanceSchema } from "./cashSchema.js";
  
const dashboardSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      // required: true,
    },
    tenantName: {
      type: String,
      // required: true,
    },
    companyName: {
      type: String,
      // required: true,
    },
    travelRequestSchema:travelRequestSchema,
    cashAdvanceSchema: cashAdvanceSchema,
    tripSchema: tripSchema, // trip Schema has travel,cash,travel expenses included.
    nonTravelExpenseSchema:nonTravelExpenseSchema,
  }); 

const dashboard = mongoose.model('dashboardNew', dashboardSchema);

export default dashboard 