import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';
import { travelExpenseSchema } from './travelExpenseSchema.js';


const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];

//---------------------cash---------  

const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
];
  
const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
  'cancelled',
];

const documentStatusEnums = [
  'paid',
  'recovered'
]

//-----------trip---------
const tripStatusEnum = [
  'upcoming',
  'modification',
  'transit',
  'completed',
  'paid and cancelled',
  'cancelled',
  'recovered',
];


// travelExpense microservice and trip microservice schema's are identical
export const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    //required: true,
  },
  tenantName: {
    type: String,
    // //required: true,
  },
  companyName: {
    type: String,
    // //required: true,
  },
  tripId:{
    type: mongoose.Types.ObjectId, 
    // unique: true,
    // //required: true,
  },
  tripNumber:{
    type: String,
    // //required: true,
  },
  tripStatus: {
    type: String,
    enum: tripStatusEnum,
    //required: true,
  },
  tripStartDate: {
    type: Date,
    //required: true,
  },
  createdBy:{
    type: {empId: String, name: String},
    required: true
    },
  tripCompletionDate: {
    type: Date,
    //required: true,
  },
  expenseAmountStatus: {
    totalCashAmount: {
      type: Number,
      default: 0,
    },
    totalAlreadyBookedExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalPersonalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalRemainingCash: {
      type: Number,
      default: 0,
    },
  },
  travelRequestData:  {
    type: travelRequestSchema,
     //required: true,
  },
  cashAdvancesData: [
    {
      tenantId: {
        type: String,
        //required: true,
      },
      travelRequestId: {
        type: String,
        // //required: true,
      },
      travelRequestNumber:{
        type: String,
        //required: true,
      },
      cashAdvanceId: {
        type: String,
        // unique: true,
        //required: true,
      },
      cashAdvanceNumber:{
        type: String,
        //required: true,
      },
      createdBy: {
          empId: String,
          name: String,
      },
      cashAdvanceStatus: {
        type: String,
        enum: cashAdvanceStatusEnum,
        //required: true,
        default: 'draft',
      },
      cashAdvanceState: {
        type: String,
        enum: cashAdvanceStateEnums,
        default: 'section 0',
        // //required: true,
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
  travelExpenseData:[
  {
    type: travelExpenseSchema,
  }
  ],
  isCompleted:{
    type:Boolean,
    default:false
  },
  isClosed:{
    type:Boolean,
    default:false
  },
  isSentToExpense: Boolean, 
  notificationSentToDashboardFlag: Boolean,
}); 







