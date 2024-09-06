import mongoose from 'mongoose';
import { approverStatusEnums} from "./travelSchema.js";

// Define constant enums for expenseStatus and expenseHeaderType 
const expenseHeaderStatusEnums = [
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
  'paid',
  'pending settlement',
  'paid and distributed',
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
  name:{type: String, default:null},
  status: {
    type: String,
    enum: approverStatusEnums,
  },
  imageUrl: String,
},
  billImageUrl: String,
  billRejectionReason: String,
},{ strict: false });

export const reimbursementSchema = new mongoose.Schema({
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
  name:{type: String, default:null},
  status: {
    type: String,
    enum: approverStatusEnums,
  },
  imageUrl: String,
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
expenseLines: [expenseLineSchema],
expenseViolations: [String],
expenseSettlementOptions:String,
expenseCancelledReason: String,
expenseSubmissionDate: Date,
expenseSettledDate: Date,
});


// Pre hook to generate and assign an ObjectId to expenseHeaderId before saving the document
reimbursementSchema.pre('validate', function(next) {
  if(!this.expenseHeaderId) {
    this.expenseHeaderId = new mongoose.Types.ObjectId(); 
  }
  next(); // Call 'next' to proceed with the save operation
})

// Function to generate the incremental number
const generateIncrementalNumber = (tenantName, incrementalValue) => {
  const formattedTenant = (tenantName || '').toUpperCase().substring(0, 3);
  return `NTER${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
};

// Pre-save hook to generate and assign expenseHeaderNumber if it doesn't exist
// reimbursementSchema.pre('validate', async function (next) {
//   if (!this.expenseHeaderNumber) {
//     // Query to find the maximum incremental value
//     const maxIncrementalValue = await this.constructor.findOne({}, 'expenseHeaderNumber')
//       .sort('-expenseHeaderNumber')
//       .limit(1);

//     // Calculate the next incremental value
//     const nextIncrementalValue = (maxIncrementalValue ? parseInt(maxIncrementalValue.expenseHeaderNumber.substring(9), 10) : 0) + 1;

//     // Generate the new expenseHeaderNumber
//     this.expenseHeaderNumber = generateIncrementalNumber(this.tenantName, nextIncrementalValue);

//     // Logging the latest generated expenseHeaderNumber
//     console.log(`Latest generated expenseHeaderNumber: ${this.expenseHeaderNumber}`);
//   }
//   next();
// });



// const Reimbursement = mongoose.model('Reimbursement', expenseReimbursementSchema);


// export default Reimbursement


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




