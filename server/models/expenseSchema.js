import mongoose from 'mongoose';

const expenseHeaderTypeEnums = ['travel', 'non travel'];

// Define constant enums for expenseStatus and expenseHeaderType
const expenseStatusEnums = [
  'draft',
  'pending approval', 
  'approved',
  'rejected',
  'pending payment',
  'paid',
  'paid and distributed',
];


const expenseLineSchema = new mongoose.Schema({
  transactionData: {
    businessPurpose: String,
    vendorName: String,
    billNumber: String,
    billDate: String,
    grossAmount: Number,
    taxes: Number,
    totalAmount: Number,
    description: String,
  },
  bookingType: String,
  billRejectionReason: String,
  isPersonalExpense: Boolean,
  modeOfPayment: String,
  billImageUrl: String,
  personalExpenseAmount: {
    type: Number,
    // This field is required if 'isPersonalExpense' is true
    required: function() {
      return this.isPersonalExpense === true;
    },
  },
});


const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];

export const expenseSchema = new mongoose.Schema({
tenantId: {
  type: String,
  required: true,
},
tenantName: {
  type: String,
  required: true,
},
companyName: {
  type: String,
  required: true,
},
travelRequestId: String, // only for travel expense
expenseHeaderID: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
},
expenseHeaderType: {
  type: String,
  enum: expenseHeaderTypeEnums,
},
expensePurpose:{  //Only for non travel expense 
  type: String,
},
approvedCashAdvance: [
  {
    amount: Number,
    currency: String,
    mode: String,
  },
],
createdBy:{
  type: {empId: String, name: String},  //employee Id by whom Expense is raised
  required: true
},
createdFor: {
  type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
  required: true
},
teamMembers:{
  type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
},
expenseStatus: {
  type: String,
  enum: expenseStatusEnums,
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
  remainingCash: {
    type: Number,
    default: 0,
  },
},
alreadyBookedExpenseLines:[expenseLineSchema],
expenseLines: [expenseLineSchema],
approvers: [
  {
    empId: String,
    name: String,
    status: {
      type: String,
      enum: approverStatusEnums,
    },
  }
],
expenseViolations: [String],
expenseRejectionReason: String,
expenseSubmissionDate: Date,
});
 
// const Expense = mongoose.model('Expense', expenseSchema);
  


