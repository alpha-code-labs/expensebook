import mongoose from 'mongoose';
import { cashAdvanceSchema } from "./cashAdvance.js";
import { tripSchema } from "./trip.js";
import { reimbursementSchema } from "./reimbursement.js";

const financeSchema = new mongoose.Schema({
  tenantId:{
    type: String,
    required: true,
  },
  tenantName:{
    type:String,
  },
  travelRequestId:{
    type: mongoose.Schema.Types.ObjectId,
    unique: function(){
      return !this.reimbursementSchema
    },
    required: function(){
      return !this.reimbursementSchema
    },
  },
  reimbursementSchema:{
    type: reimbursementSchema,
    required:false,
  },
   cashAdvanceSchema: cashAdvanceSchema,
   tripSchema: tripSchema,
});

const Finance = mongoose.model("Finance", financeSchema);

export default Finance




