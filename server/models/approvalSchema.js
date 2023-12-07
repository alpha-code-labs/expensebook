import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';
import { cashAdvanceSchema } from './cashSchema.js';
import { tripSchema } from './tripSchema.js';
import { expenseSchema } from './expenseSchema.js';

// Define constant enums for status values
// const approvalStatusEnums = ['draft', 'pending approval', 'approved', 'rejected', 'null'];
const approvalTypesEnums = ['travel', 'travel-expense', 'non-travel-expense'];

//approval schema
const approvalSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      required: true,
    },
    tenantName:{
      type: String,
    },
    companyName:{
      type: String,
    },
    approvalId:{
      type: mongoose.Schema.Types.ObjectId,
    },
    approvalType: { // to be added when getting data from other microservices
        type: String,
        enum: approvalTypesEnums,
        required: true,
       },
    // approvalStatus: { 
    //     type: String,
    //     enum: approvalStatusEnums,
    //   }, 
    embeddedTravelRequest: travelRequestSchema,
    embeddedCashAdvance: cashAdvanceSchema ,
    embeddedTripSchema: tripSchema,
    embeddedExpenseSchema: expenseSchema,
    notificationSentToDashboardFlag: Boolean,
  });
  
  // Pre hook to generate and assign an ObjectId to approvalId before saving the document
  approvalSchema.pre('validate', function(next) {// Include 'next' as a parameter
  if(!this.approvalId) {
    this.approvalId = new mongoose.Types.ObjectId(); 
  }
  next(); // Call 'next' to proceed with the save operation
})
  
export const Approval = mongoose.model('Approval', approvalSchema);
  








