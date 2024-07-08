import mongoose from 'mongoose';
import {travelRequestSchema} from './travelRequest.js';

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
  'cancelled',
  'paid and cancelled',
  'recovered',
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
  travelRequestData:  {
      type: travelRequestSchema, 
      required: true,
    },
  cashAdvancesData: [
    {   
      tenantId: {
        type: String,
        required: true,
      },
      travelRequestId: {
        type: String,
        required: true,
      },
      totalConvertedAmount : Number,
      defaultCurrency: {},
      travelRequestNumber:{
        type: String,
        required: true,
      },
      tripName:{
        type:String,
        required: true,
      },
      
      cashAdvanceReason:{
        type:String,
        required: true,
      },
      travelType: String,
      cashAdvanceId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
      },
      cashAdvanceNumber:{
        type: String,
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
          convertedAmount: Number,
          exchangeRate: Number,
          currency: {},
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
      assignedTo:{empId:String, name:String},
      paidBy:{empId:String, name:String},
      recoveredBy:{empId:String, name:String},
      cashAdvanceRequestDate: Date,
      cashAdvanceApprovalDate: Date,
      cashAdvanceSettlementDate: Date,
      cashAdvanceViolations: String,
      cashAdvanceRejectionReason: String,
    },
  ],
  totalAdvanceRequested: Number,
  totalAdvanceGranted: Number,
  totalAdvanceRecovered: Number,
});

const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

export default CashAdvance

 