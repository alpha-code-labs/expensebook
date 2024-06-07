import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';

const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
];

const cashAdvanceStatusEnum = [
'draft',
'pending approval',
'approved',
'rejected',
'awaiting pending settlement',
'pending settlement',
'paid',
'recovered',
];

  
const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];

// Define the Cash Advance schema with a reference to Travel Request
export const cashAdvanceSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    // required: true,
  },
  tenantName: {
    type: String,
  },
  companyName: {
    type: String,
  },
  travelRequestId: {
      type: String,
  },
  embeddedTravelRequest: travelRequestSchema,
  cashAdvances: [
    {
      tenantId: {
        type: String,
        // required: true,
      },
      travelRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        // required: true,
      },
      cashAdvanceId: {
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        // unique: true,
        // required: true,
      },
      createdBy: {
          empId: String,
          name: String,
      },
      cashAdvanceStatus: {
        type: String,
        enum: cashAdvanceStatusEnum,
        // required: true,
        default: 'draft',
      },
      cashAdvanceState: {
        type: String,
        enum: cashAdvanceStateEnums,
        default: 'section 0',
        // required: true,
      },
      amountDetails: [
        {
          amount: Number,
          currency: String,
          mode: String,
        },
      ],
      approvers: [
        {
          empId: String,
          name: String,
          status: {
            type: String,
            enum: approverStatusEnums,
          },
        },
      ],
      cashAdvanceRequestDate: Date,
      cashAdvanceApprovalDate: Date,
      cashAdvanceSettlementDate: Date,
      cashAdvanceViolations: [String],
      cashAdvanceRejectionReason: String,
    },
  ],
});

// // Create the Cash Advance model
// const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

