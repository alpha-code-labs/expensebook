import mongoose from 'mongoose';

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  'draft',
  'pending settlement',
  'cancelled',
];

const lineItemStatusEnums = [
  'draft',
  'save',
  'submit',
  'delete'
]

const expenseHeaderTypeEnums = ['non_Travel'];

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
  expenseLineAllocation : [{ //non travel expense allocation comes here
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
  }], //expense category comes here,  non-travel - office supplies, subscriptions,etc
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
  billImageUrl: String,
});


export const nonTravelExpenseSchema = new mongoose.Schema({
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
expenseHeaderID: {
  type: mongoose.Schema.Types.ObjectId,
},
expenseHeaderNumber: {
  type: String,
  required: true,
//   unique: true
},
expenseHeaderType: {
    type: String,
    enum: expenseHeaderTypeEnums,
  },
createdBy:{
  type: {empId: String, name: String},  //employee Id by whom Expense is raised
  required: true
},
expenseHeaderStatus: { // old name expenseStatus
  type: String,
  enum: expenseHeaderStatusEnums,
},
expenseAmountStatus: {
  totalExpenseAmount: {
    type: Number,
    default: 0,
  },
},
expenseLines: [expenseLineSchema],
expenseSubmissionDate: Date,
});
 

// Pre hook to generate and assign an ObjectId to expenseHeaderID before saving the document
nonTravelExpenseSchema.pre('validate', function(next) {
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
nonTravelExpenseSchema.pre('validate', async function (next) {
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



// const NonTravelExpense = mongoose.model('NonTravelExpense', nonTravelExpenseSchema);


// export default NonTravelExpense


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