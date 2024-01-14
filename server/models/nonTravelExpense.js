<<<<<<< HEAD
const  mongoose = require('mongoose') ;

 const nonExpenseSchema = new mongoose.Schema({
  tripId:"String" , 
  expenseHeaderId : "String" , 
  
  expenseHeaderStatus: "String" ,
  tenantId: "String" ,
  tenantName: "String" ,
  companyName: "String" ,
  travelRequestId: "String" ,
  expenseHeaderNumber: "String" ,
  expenseHeaderType: "String" ,
  
  createdBy:{
    type:Object
  } , 
 
  
  createdFor :{type : Object} , 
  
  
  teamMembers :{ type : Array} , 
  
  
  alreadyBookedExpenseLines : {type : Array} , 
  
  expenseLines : {type :Array } , 
   
  
  approvers : {type :Array } ,
  
  expenseViolations: {type :Array } ,
  expenseRejectionReason : "String"
  ,
  expenseSubmissionDate : Date ,

=======
const mongoose=require("mongoose");


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
  }], //expense category comes here,non-travel - office supplies, subscriptions,etc
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
expenseHeaderID: {
  type: mongoose.Schema.Types.ObjectId,
},
expenseHeaderNumber: {
    type: String,
  },
// expenseHeaderID: {
//   type: String,
//   required: true,
// },
expenseHeaderType: 'non-travel',
expensePurpose:{  //Only for non travel expense
  type: String,
},
createdBy:{
  type: {empId: String, name: String},  //employee Id by whom Expense is raised
  required: true
},
createdFor: {
  type: {empId: String, name: String},
  // required: true
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
expenseLines: [expenseLineSchema],
expenseViolations: [String],
expenseSubmissionDate: Date,
>>>>>>> df1795bec760f80bf1717af48375b763ef7d1b47
});
 


<<<<<<< HEAD


module.exports = mongoose.model('nonTravelExpense', nonExpenseSchema);



=======
// Pre hook to generate and assign an ObjectId to expenseHeaderID before saving the document
expenseSchema.pre('validate', function(next) {// Include 'next' as a parameter
  if(!this.expenseHeaderID) {
    this.expenseHeaderID = new mongoose.Types.ObjectId();
  }
  next(); // Call 'next' to proceed with the save operation
})




const Expense = mongoose.model('Expense', expenseSchema);


export { Expense as nonTravelExpense };
>>>>>>> df1795bec760f80bf1717af48375b763ef7d1b47





