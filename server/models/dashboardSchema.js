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
      unique: function() {
        return !this.reimbursementSchema; // Ensure uniqueness only if reimbursementSchema is not present
      },
      required: function() {
        return !this.reimbursementSchema; // Make required only if reimbursementSchema is not present
      },
    },
    reimbursementSchema: {
      type: reimbursementSchema,
      required: false, // Make reimbursementSchema optional
    },
    travelRequestSchema:travelRequestSchema,
    cashAdvanceSchema: cashAdvanceSchema,
    tripSchema: tripSchema, // trip Schema has travel,cash,travel expenses included.
  }); 

const dashboard = mongoose.model('dashboard', dashboardSchema);

export default dashboard 






