import mongoose from 'mongoose';
import { travelExpenseSchema } from './travelExpenseSchema.js';
import { travelRequestSchema } from './travelSchema.js';

//---------------travel---------
const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];


//---------------------cash---------

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
  'recovered'
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
export const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName: {
    type: String,
    // required: true,
  },
  companyName: {
    type: String,
    // required: true,
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
    required: true,
  },
  tripStartDate: {
    type: Date,
    required: true,
  },
  tripCompletionDate: {
    type: Date,
    required: true,
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
    isSentToExpense: Boolean, 
    notificationSentToDashboardFlag: Boolean,
    travelRequestData: {
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
            type: mongoose.Types.ObjectId, 
            required: true,
          },
          travelRequestNumber:{
            type: String,
            required: true,
          },
          cashAdvanceId: {
            type: mongoose.Types.ObjectId, 
            // unique: true,
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
      type: travelExpenseSchema,
      required:true
     }
      ],
}); 





