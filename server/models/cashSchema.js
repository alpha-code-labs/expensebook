import mongoose from 'mongoose';
import travelRequestSchema from './travelRequest.js';

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
  'cancelled',
  'paid and cancelled'
];

const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
];

const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];



const cashAdvanceSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
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
  embeddedTravelRequest:  {
      type: travelRequestSchema, 
      required: true,
    },
  cashAdvances: [
    {
      tenantId: {
        type: String,
        required: true,
      },
      travelRequestId: {
        type: String,
        required: true,
      },
      cashAdvanceId: {
        type: String,
        unique: true,
        required: true,
      },
      createdBy: {
          empId: String,
          name: String,
      },
      cashAdvanceStatus: {
        type: String,
        enum: cashAdvanceStatusEnum,
        required: true,
        default: 'draft',
      },
      cashAdvanceState: {
        type: String,
        enum: cashAdvanceStateEnums,
        default: 'section 0',
        required: true,
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

const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

export default CashAdvance

 