import mongoose from 'mongoose'
import { travelRequestSchema } from './travelSchema.js';
import { cashAdvanceSchema } from './cashSchema.js';

const tripStatusEnum = [
    'upcoming',
    'modification',
    'transit',
    'completed',
    'cancelled',
  ];
  
const approverStatusEnums = [
    'pending approval',
    'approved',
    'rejected',
  ];
  
export const tripSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      // required: true,
    },
    userId:{
      empId: String,
      name: String},
    tripPurpose:{
      type: String,
    },
    tripStatus: {
      type: String,
      enum: tripStatusEnum,
      // required: true,
    },
    tripStartDate: {
      type: Date,
      // required: true,
    },
    tripCompletionDate: {
      type: Date,
      // required: true,
    },
    notificationSentToDashboardFlag: Boolean,
  
    // Embedded documents for quick access
    embeddedTravelRequest: travelRequestSchema,
    embeddedCashAdvance: cashAdvanceSchema,
  }); 
  