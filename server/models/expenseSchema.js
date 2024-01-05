import mongoose from 'mongoose';

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

export const travelExpenseSchema = new mongoose.Schema({
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
travelRequestNumber: String, 
expenseHeaderID: {
  type: mongoose.Schema.Types.ObjectId,
},
expenseHeaderNumber: {
  type: String,
  required: true,
  //  unique: true
},
expenseHeaderType: {
  type: String,
  enum: expenseHeaderTypeEnums,
},
expensePurpose:{  
  type: String,
},
approvedCashAdvance: [ // NOT NEEDED, MOVED TO expenseAmountStatus
  {
    amount: Number,
    currency: String,
    mode: String,
  },
],
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
sendForNotification:Boolean, // always set to false when updating dashboard
});
 
//Multiple expenseReports can be added.
const expenseSchema = new mongoose.Schema({
  travelExpenseData: {
    type: [travelExpenseSchema],
    required: true,
  },
});

// Pre hook to generate and assign an ObjectId to expenseHeaderID before saving the document
expenseSchema.pre('validate', function(next) {
  if(!this.expenseHeaderID) {
    this.expenseHeaderID = new mongoose.Types.ObjectId(); 
  }
  next(); // Call 'next' to proceed with the save operation
})

// Function to generate the incremental number
const generateIncrementalNumber = (tenantName, incrementalValue) => {
  const formattedTenant = (tenantName || '').toUpperCase().substring(0, 3);
  return `ER${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
};

// Pre-save hook to generate and assign expenseHeaderNumber if it doesn't exist
expenseSchema.pre('validate', async function (next) {
  if (!this.expenseHeaderNumber) {
    // Query to find the maximum incremental value
    const maxIncrementalValue = await this.constructor.findOne({}, 'expenseHeaderNumber')
      .sort('-expenseHeaderNumber')
      .limit(1);

    // Calculate the next incremental value
    const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.expenseHeaderNumber.substring(9), 10) : 0) + 1;

    // Generate the new expenseHeaderNumber
    this.expenseHeaderNumber = generateIncrementalNumber(this.tenantName, nextIncrementalValue);

    // Logging the latest generated expenseHeaderNumber
    console.log(`Latest generated expenseHeaderNumber: ${this.expenseHeaderNumber}`);
  }
  next();
});



// const Expense = mongoose.model('Expense', expenseSchema);


// export default Expense 

// const saveTravelExpenseData = new Expense({
//   travelExpenseData:[
//     {
//     tenantId: "sampleTenantId",
//     tenantName: "Sample Tenant",
//     companyName: "Sample Company",
//     travelRequestId: "sampleTravelRequestId",
//     travelRequestNumber: "TR001",
//     tripData: {
//       // You need to provide dummy data for the tripSchema as well
//       // Assuming tripSchema has fields like destination, startDate, endDate, etc.
//     },
//     expenseHeaderType: "travel",
//     expensePurpose: "Expense Purpose",
//     approvedCashAdvance: [
//       {
//         amount: 500,
//         currency: "USD",
//         mode: "Cash",
//       },
//     ],
//     createdBy: {
//       empId: "empId",
//       name: "name",
//     },
//     expenseHeaderStatus: "Pending",
//     expenseAmountStatus: {
//       totalCashAmount: 500,
//       totalExpenseAmount: 0,
//       totalPersonalExpense: 0,
//       remainingCash: 500,
//     },
//     alreadyBookedExpenseLines: [
//     ],
//     expenseLines: [
//     ],
//     approvers: [
//       {
//         empId: "approver1Id",
//         name: "Approver 1",
//         status: "Pending",
//       },
//       {
//         empId: "approver1Id",
//         name: "Approver 1",
//         status: "Pending",
//       },
//     ],
//     expenseViolations: ["Violation 1", "Violation 2"],
//     expenseRejectionReason: "Sample Rejection Reason",
//     expenseSubmissionDate: new Date("2023-01-01T12:00:00Z"),
//   }
//   ]
// })




// // Pre-save hook to generate and assign expenseHeaderNumber if it doesn't exist
// expenseSchema.pre('save', async function (next) {
//   if (!this.expenseHeaderNumber) {

//     const generateIncrementalNumber = (tenantName, ex, incrementalValue) => {
//       const formattedTenant = (tenantName || '00').toString().substring(0, 2);
//       const formattedEx = (ex || '00').toString().substring(0, 2);
//       return `${formattedTenant}${formattedEx}${incrementalValue.toString().padStart(4, '0')}`;
//     };

//     const maxIncrementalValue = await this.constructor.findOne({}, 'expenseHeaderNumber')
//       .sort('-expenseHeaderNumber')
//       .limit(1);

//     const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.expenseHeaderNumber.substring(4), 10) : 0) + 1;

//     this.expenseHeaderNumber = generateIncrementalNumber('tenantName', 'ex', nextIncrementalValue);
//   }
//   next();
// });



//---------------------------------
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
//             tripData: '',
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

//-----------------------------------
// expenseSchema.post('save', async function (doc) {
//   if (doc.expenseHeaderType === 'non_Travel') {
//     try {
//       const ExpenseModel = this.constructor; // Access the model directly
//       await ExpenseModel.updateOne(
//         { _id: doc._id },
//         {
//           $unset: {
//             'travelRequestId': '',
//             'tripData': '',
//             'teamMembers': '',
//             'expenseAmountStatus.totalCashAmount': '',
//             'expenseAmountStatus.remainingCash': '',
//             'alreadyBookedExpenseLines': '',
//             'approvers': '',
//             'approvedCashAdvance': ''
//           }
//         }
//       );
//       console.log('Fields removed successfully!');
//     } catch (error) {
//       console.error('Error removing fields:', error);
//     }
//   }
// });