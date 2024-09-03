import mongoose from 'mongoose';

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'paid',
  'pending settlement',
  'cancelled',
  null
];

const lineItemStatusEnums = [
  'draft',
  'pending approval',
  'submit',
  'delete',
  'approved',
  'rejected'
]

const expenseHeaderTypeEnums = ['reimbursement'];

const approverStatusEnums = ["pending approval", "approved", "rejected"];


const expenseLineSchema = new mongoose.Schema({
    lineItemId:mongoose.Schema.Types.ObjectId,
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
    // expenseCategory: {
    //   categoryName: String,
    //   fields:[],
    //   travelClass: String,
    // },
    modeOfPayment: String,
    isInMultiCurrency: Boolean, // if currency is part of multiCurrency Table
    multiCurrencyDetails: {
      type: {
        convertedCurrencyType: String,
        totalAmountInConvertedCurrency: Number,
        conversionRateToDefaultCurrency: Number,
        convertedTotalAmountToDefaultCurrency: Number,
      },
      required: function() {
        return this.isInMultiCurrency === true;
      },
    },
    billImageUrl: String,
    billRejectionReason: String,
},{strict: false});

export const   reimbursementSchema = new mongoose.Schema({
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
expenseHeaderId: {
  type: String,
  required: true,
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
  default: 'null'
},
travelAllocationFlags:{ //Comes from HRMaster -Based on this expense booking screen changes
  level1:Boolean,
  level2:Boolean,
  level3:Boolean,
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
actionedUpon:{
  type:Boolean,
  default:false
},
expenseCancelledReason: String,
expenseSubmissionDate: Date,
expenseSettlementOptions:String,
rejectionReason: String,
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

