import mongoose from 'mongoose';
import { itinerarySchema } from './travelSchema';

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
  expenseLineId:mongoose.Schema.Types.ObjectId,
  transactionData: {
    businessPurpose: String,
    vendorName: String,
    billNumber: String,
    billDate: String,
    taxes: Number,
    totalAmount: Number,
    description: String,
  },
  lineItemStatus: {
    type: String,
    enum: lineItemStatusEnums,
  },
  expenseLineAllocation : [{ //Travel expense allocation comes here
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  alreadySaved: Boolean, // when saving a expense line , make sure this field marked as true
  expenseLineCategory: [{
    categoryName: String,
  }], //expense category comes here, ex- flights, cabs for travel ,etc
  modeOfPayment: String,
  isInMultiCurrency: Boolean, // if currency is part of multiCurrency Table
  multiCurrencyDetails: {
    type: [{
      nonDefaultCurrencyType: String,
      originalAmountInNonDefaultCurrency: Number,
      conversionRateToDefault: Number,
      convertedAmountToDefaultCurrency: Number,
    }],
    required: function() {
      return this.isInMultiCurrency === true;
    },
  },
  isPersonalExpense: Boolean, //if bill has personal expense, can be partially or entire bill.
  personalExpenseAmount: {
    type: Number,
    // This field is required if 'isPersonalExpense' is true
    required: function() {
      return this.isPersonalExpense === true;
    },
  },
  billImageUrl: String,
  billRejectionReason: String,
});


const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];

// 
export const travelExpenseSchema = new mongoose.Schema([
  {
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
    travelRequestId: String,
    expenseHeaderID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expenseHeaderType: {
      type: String,
      enum: expenseHeaderTypeEnums,
    },
    expenseStatus: {
      type: String,
      enum: expenseStatusEnums,
    },
    alreadyBookedExpenseLines: {
      type: [itinerarySchema],
      default: undefined,
    },
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
  }
]);

// const Expense = mongoose.model('Expense', travelExpenseSchema);
  


