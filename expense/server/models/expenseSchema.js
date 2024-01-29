import mongoose from 'mongoose';
import { tripSchema } from './tripSchema.js';

const expenseHeaderTypeEnums = ['travel', 'non_Travel'];

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  'draft',
  'pending approval', 
  'approved',
  'rejected',
  'pending payment',
  'paid',
  'pending settlement',
  'pending payup',
  'cancelled',
  'paid and distributed',
];

const lineItemStatusEnums = [
  'draft',
  'save',
  'submit',
  'delete'
]


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
  lineItemStatus: {
    type: String,
    enum: lineItemStatusEnums,
  },
  expenseLineAllocation : [{ //Travel expense allocation and non travel expense allocation comes here
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  expenseLineCategory: [{
    categoryName: String,
    accountLine: String,
  }], //expense category comes here, ex- flights, cabs for travel , non-travel - office supplies, subscriptions,etc
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

const expenseSchema = new mongoose.Schema({
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
embeddedTrip: tripSchema, //Only for travel expense
expenseHeaderID: {
  type: mongoose.Schema.Types.ObjectId,
},

// expenseHeaderID: {
//   type: String,
//   required: true,
// },
expenseHeaderType: {
  type: String,
  enum: expenseHeaderTypeEnums,
},
expensePurpose:{  //Only for non travel expense 
  type: String,
},
approvedCashAdvance: [ // NOT NEEDED, MOVED TO expenseAmountStatus
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
  type: {empId: String, name: String}, //employee Id's for whom Expense is raised
  // required: true
},
teamMembers:{
  type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
},
expenseHeaderStatus: { // old name expenseStatus
  type: String,
  enum: expenseHeaderStatusEnums,
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
  totalPersonalExpense:{
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
 

// Pre hook to generate and assign an ObjectId to expenseHeaderID before saving the document
expenseSchema.pre('validate', function(next) {// Include 'next' as a parameter
  if(!this.expenseHeaderID) {
    this.expenseHeaderID = new mongoose.Types.ObjectId(); 
  }
  next(); // Call 'next' to proceed with the save operation
})


//FOR NON TRAVEL EXPENSE ThIS PRE HOOK DISABLES TRAVEL EXPENSE FIELDS IN SCHEMA
// expenseSchema.post('save', async function(doc) {
//   if (doc.expenseHeaderType === 'non_Travel') {
//     try {
//       const ExpenseModel = this.constructor; // Access the model directly
//       await ExpenseModel.updateOne(
//         { _id: doc._id },
//         {
//           $unset: {
//             travelRequestId: '',
//             embeddedTrip: '',
//             teamMembers: '',
//             expenseAmountStatus.totalCashAmount: '',
//             expenseAmountStatus.remainingCash: '',
//             alreadyBookedExpenseLines: '',
//             approvers: '',
//             approvedCashAdvance: ''
//           }
//         }
//       );
//       console.log('Fields removed successfully!');
//     } catch (error) {
//       console.error('Error removing fields:', error);
//     }
//   }
// });
expenseSchema.post('save', async function (doc) {
  if (doc.expenseHeaderType === 'non_Travel') {
    try {
      const ExpenseModel = this.constructor; // Access the model directly
      await ExpenseModel.updateOne(
        { _id: doc._id },
        {
          $unset: {
            'travelRequestId': '',
            'embeddedTrip': '',
            'teamMembers': '',
            'expenseAmountStatus.totalCashAmount': '',
            'expenseAmountStatus.remainingCash': '',
            'alreadyBookedExpenseLines': '',
            'approvers': '',
            'approvedCashAdvance': ''
          }
        }
      );
      console.log('Fields removed successfully!');
    } catch (error) {
      console.error('Error removing fields:', error);
    }
  }
});



const Expense = mongoose.model('Expense', expenseSchema);


export default Expense 
