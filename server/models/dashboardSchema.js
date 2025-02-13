import mongoose from "mongoose";
import { travelRequestSchema } from "./travelSchema.js";
import { cashAdvanceSchema } from "./cashSchema.js";
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
      // unique: true,
      required: true
    },
    travelStartDate:{ // temporary added, tripStartDate should be here when a new TR is raised, update this when ever any change in TR.
      type: Date,
    },
    travelRequestSchema:travelRequestSchema,
    cashAdvanceSchema: cashAdvanceSchema,
    tripSchema: tripSchema, // trip Schema has travel,cash,travel expenses included.
  }); 

const dashboard = mongoose.model('dashboard', dashboardSchema);

export default dashboard 






