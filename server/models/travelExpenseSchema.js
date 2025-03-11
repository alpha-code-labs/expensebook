import mongoose from "mongoose";
import { approverStatusEnums, itinerarySchema } from "./travelSchema.js";

//-----travel expense --------------
const expenseHeaderTypeEnums = ['travel'];

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  "new",
  'draft',
  'pending approval', 
  'approved',
  'rejected',
  'paid',
  'pending settlement',
  'paid and distributed',
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
  'paid',
  'paid and distributed',
]


//it is dynamic, any expense lines fields can be added
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
  billImageUrl: String,
  billRejectionReason: String,
},{ strict: false });

export const travelExpenseSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      required: true,
    },
    tenantName: {
      type: String,
      // required: true,
    },
    companyName: {
      type: String,
      // required: true,
    },
    travelRequestId: {
      type: mongoose.Types.ObjectId, 
      // required: true,
    },
    travelRequestNumber:{
      type: String,
      // required: true,
    },
    expenseHeaderNumber:{
      type: String,
    },
    expenseHeaderId: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    expenseHeaderType: { 
      type: String,
      enum: expenseHeaderTypeEnums,
    },
    createdBy:{
      type: {empId: String, name: String}, //employee Id by whom TR is raised
      // required: true
      },
    travelAllocationFlags:{ //Comes from HRMaster -Based on this expense booking screen changes
      level1:Boolean,
      level2:Boolean,
      level3:Boolean,
    },
    expenseHeaderStatus: { 
      type: String,
      enum: expenseHeaderStatusEnums,
      default: "new",
    },
    alreadyBookedExpenseLines: {
      type: itinerarySchema,
      default: undefined,
    },
    expenseLines: [expenseLineSchema],
    approvers: [ // added directly from travel request approvers
      {
        empId: String,
        name: String,
        status: {
          type: String,
          enum: approverStatusEnums,
        },
        imageUrl: String,
      }
    ],
    expenseSettlement:{
      type:String,
    },
    defaultCurrency:{
      type: Object,
    },
    allocations:[],
    violations: [String],
    travelType: String,
    rejectionReason: String,
    paidBy:{empId:String, name:String},
    recoveredBy:{empId:String, name:String},
    submissionDate: Date,
    settlementDate:Date,
    settlementBy:{
      empId:{type: String, default:null},
      name:{type: String, default:null}
    },
    actionedUpon:{
        type:Boolean,
        default:false
    },
    submissionDate: Date,
    settlementDate:Date,
    entriesFlag:{
    type:Boolean,
    required:true,
    default:false,
    },
})