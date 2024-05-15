import mongoose from "mongoose";
import { travelRequestSchema } from "./travelSchema.js";
import { cashAdvanceSchema } from "./cashSchema.js";
import { reimbursementSchema } from "./reimbursementSchema.js";
import { tripSchema } from "./tripSchema.js";
  
const dashboardSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      required: true,
    },
    tenantName: {
      type: String,
      // required: true,
    },
    companyName: {
      type: String,
      // required: true,
    },
    travelRequestId: {
      type: mongoose.Schema.Types.ObjectId, 
      unique: true,
      required: true,
    },
    travelRequestSchema:travelRequestSchema,
    cashAdvanceSchema: cashAdvanceSchema,
    tripSchema: tripSchema, // trip Schema has travel,cash,travel expenses included.
    reimbursementSchema:reimbursementSchema, 
  }); 

const dashboard = mongoose.model('dashboardMonday', dashboardSchema);

export default dashboard 
