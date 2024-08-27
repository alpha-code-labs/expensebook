import mongoose from 'mongoose';

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  'draft',
  'paid',
  'pending settlement',
  'cancelled',
   null
];

const lineItemStatusEnums = [
  'draft',
  'save',
  'submit',
  'delete'
]

const expenseHeaderTypeEnums = ['reimbursement'];

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

const expenseReimbursementSchema = new mongoose.Schema({
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
expenseLines: [expenseLineSchema],
expenseViolations: [String],
expenseCancelledReason: String,
expenseSubmissionDate: Date,
expenseSettledDate: Date,
});


// Pre hook to generate and assign an ObjectId to expenseHeaderId before saving the document
expenseReimbursementSchema.pre('validate', function(next) {
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
// expenseReimbursementSchema.pre('validate', async function (next) {
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



const Reimbursement = mongoose.model('ReimbursementFriday', expenseReimbursementSchema);


export default Reimbursement


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