import mongoose from 'mongoose';
import { approverStatusEnums} from "./travelSchema.js";

// Define constant enums for expenseStatus and expenseHeaderType
export const expenseHeaderStatusEnums = [
  'new',
  'draft',
  'pending approval', 
  'approved',
  'rejected',
  'paid',
  'pending settlement',
  'paid and distributed',
  'cancelled',
  null
];

const lineItemStatusEnums = [
  'draft',
  'save',
  'submit',
  'delete',
  'pending approval',
  'approved',
  'rejected',
  'pending settlement',
  'paid and distributed',
  'paid',
]

const documentStatusEnums = [
  'paid',
  'recovered'
]

const expenseHeaderTypeEnums = ['reimbursement'];

const expenseLineSchema = new mongoose.Schema({
  expenseLineId:mongoose.Schema.Types.ObjectId,
  travelType: String,
  lineItemStatus: {
    type: String,
    enum: lineItemStatusEnums,
  },
  expenseLineAllocation : [{ //Travel expense allocation comes here
    headerName: String,
    headerValues: String,
  }],
  expenseAllocation_accountLine: String,
  alreadySaved: Boolean, // when saving a expense line , make sure this field marked as true
  expenseCategory: {
    // categoryName: String,
    // fields:[],
    // travelClass: String,
  }, //expense category comes here, ex- flights, cabs for travel ,etc
  modeOfPayment: String,
  isMultiCurrency: {
    type: Boolean,
    default: false,
  },// if currency is part of multiCurrency Table
  multiCurrencyDetails: {
    type: {
      nonDefaultCurrencyType: String,
      originalAmountInNonDefaultCurrency: Number,
      conversionRateToDefault: Number,
      convertedAmountToDefaultCurrency: Number,
    },
    // required: function() {
    //   return this.isMultiCurrency === true;
    // },
  },
  isPersonalExpense:{
    type:Boolean,
    default: false
  }, //if bill has personal expense, can be partially or entire bill.
  personalExpenseAmount: {
    type: Number,
    // This field is required if 'isPersonalExpense' is true
    required: function() {
      return this.isPersonalExpense === true;
    },
  },
  approvers: [
    {
      empId: String,
      name: String,
      status: {
        type: String,
        enum: approverStatusEnums,
      },
      imageUrl: String,
    },
  ],
  expenseSettledDate: Date,
  settlementBy:{
  empId:{type: String, default:null},
  name:{type: String, default:null}
},
  billImageUrl: String,
  billRejectionReason: String,
},{ strict: false });

const reimbursementSchema = new mongoose.Schema({
tenantId: {
  type: String,
  //required: true,
},
tenantName: {
  type: String,
  // required: true,
},
companyName: {
  type: String,
 //required: true,
},
expenseHeaderId: {
  type: String,
 //required: true,
},
expenseHeaderNumber: {
  type: String,
 //required: true,
//   unique: true
},
expenseHeaderType: {
    type: String,
    enum: expenseHeaderTypeEnums,
  },
expensePurpose:{ 
  type: String,
},
createdBy:{
  type: {empId: String, name: String},  //employee Id by whom Expense is raised
  required: true
},
expenseHeaderStatus: { 
  type: String,
  enum: expenseHeaderStatusEnums,
  default: null
},
expenseAmountStatus: {
  totalCashAmount: {
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
travelAllocationFlags:{ //Comes from HRMaster -Based on this expense booking screen changes
  level1:Boolean,
  level2:Boolean,
  level3:Boolean,
},
actionedUpon:{
  type:Boolean,
  required:true,
  default:false,
},
paidBy:{
  empId:{type: String, default: null},
  name: {type:String, default: null},
},
settlementBy:{
  empId:{type: String, default:null},
  name:{type: String, default:null}
},
entriesFlag:{
type:Boolean,
required:true,
default:false,
},
defaultCurrency:{
  type: Object,
},
approvers: [
    {
      empId: String,
      name: String,
      status: {
        type: String,
        enum: approverStatusEnums,
      },
      imageUrl: String,
    },
  ],
  settlementDetails: [{
    url: { type: String},
    comment:{type:String},
    status: {
    type: String,
    enum: documentStatusEnums,
  },
}],
expenseLines: [expenseLineSchema],
expenseViolations: [String],
expenseSettlementOptions:String,
expenseCancelledReason: String,
expenseSubmissionDate: Date,
expenseSettledDate: Date,
},{timestamps:true});

const REIMBURSEMENT = mongoose.model('Reimbursement', reimbursementSchema);

export default REIMBURSEMENT


