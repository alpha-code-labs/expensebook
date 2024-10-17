import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';


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
  'recovered'
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


const documentStatusEnums = [
  'paid',
  'recovered'
]

export const cashAdvanceSchema = new mongoose.Schema({
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
        // required: true,
      },
      travelRequestNumber:{
        type: String,
        required: true,
      },
      cashAdvanceId: {
        type: String,
        // unique: true,
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
      assignedTo:{
        empId:{type:String, default:null},
        name:{type:String, default:null},
      },
      paidBy:{
        empId:{type: String, default: null},
        name: {type:String, default: null},
      },
      recoveredBy:{
        empId:{type: String, default: null},
       name:{type: String, default: null},
      },
      actionedUpon:{
        type:Boolean,
        default:false
      },
      recoveryFlag:{
        type:Boolean,
        required:true,
        default:false,
      },
      paidFlag:{
        type:Boolean,
        required:true,
        default:false,
      },
      settlementDetails: [{
        url: { type: String},
        comment:{type:String},
        status: {
        type: String,
        enum: documentStatusEnums,
      },
    }],
      cashAdvanceRequestDate: Date,
      cashAdvanceApprovalDate: Date,
      cashAdvanceSettlementDate: Date,
      cashAdvanceViolations: String,
      cashAdvanceRejectionReason: String,
    },
  ],
});


// const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);
// export default CashAdvance






