import mongoose from 'mongoose';
import { cashAdvanceSchema } from "./cashAdvance.js";
import { tripSchema } from "./trip.js";

const financeSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName: {
    type: String,
  },
  travelRequestId:{
    type: String,
    required: true,
    unique:true
  },
  // travelRequestId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: function() {
  //     return !this.reimbursementSchema;
  //   },
  // },
  // reimbursementSchema: {
  //   type: reimbursementSchema,
  //   required: false,
  // },
  cashAdvanceSchema: cashAdvanceSchema,
  tripSchema: tripSchema,
});

const Finance = mongoose.model("Finance", financeSchema);

export default Finance;
