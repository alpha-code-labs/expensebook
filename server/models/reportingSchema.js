import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';
import { travelExpenseSchema } from './travelExpenseSchema.js';


//---------------------cash---------
const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];
  
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
  'cancelled',
  'paid and cancelled',
  'recovered',
];

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
const reportingSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index:true,
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
    unique: true,
    // required: true,
    // index:true,
  },
  tripId:{
    type: mongoose.Types.ObjectId, 
    // unique: true,
    // required: true,
  },
  tripNumber:{
    type: String,
    // required: true,
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
  createdBy:{
    type: {empId: String, name: String},
    // required: true
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
  travelRequestData:{
      type: travelRequestSchema,
      required: true
  },
  cashAdvancesData: [
        {
          tenantId: {
            type: String,
            // required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          travelRequestNumber:{
            type: String,
            // required: true,
          },
          cashAdvanceId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          cashAdvanceNumber:{
            type: String,
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
  travelExpenseData:[
      {
        type:travelExpenseSchema,
        required:true
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

const reporting = mongoose.model('reporting', reportingSchema)
export default reporting




export{
  approverStatusEnums,
  cashAdvanceStatusEnum,
  tripStatusEnum,
}








