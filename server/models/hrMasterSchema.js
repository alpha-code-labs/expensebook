import mongoose from "mongoose"

// employee schema
const employeeSchema = new mongoose.Schema({
  employeeDetails: {}, //for now it makes sense to make it flexible, extracting groups tag from here
  group: [String], 
  employeeRoles: {
    employee: Boolean,
    employeeManager: Boolean,
    finance: Boolean,
    travelAdmin: Boolean,  
    superAdmin: Boolean,
  },
  canDelegate: Boolean,
})

// company details schema
const companyDetailsSchema = new mongoose.Schema({
  companyName: String,
  companyLogo: String,
  companyEmail: String,
  companyHeadquarters: String,
  companySize: String,
  defaultCurrency: String, // default currency symbol is needed or not here
  industry: String,
})

const ExchangeValueSchema = new mongoose.Schema({
  currency: {},
  value: Number, // Represents the exchange rate for the entered currency
});

// HR & Company Structure schema
const hrCompanySchema = new mongoose.Schema({
  tenantId: String,
  tenantName: String,
  companyName: String,
  flags:{
    DIY_FLAG: Boolean,
    GROUPING_FLAG: Boolean,
    ORG_HEADERS_FLAG: Boolean,
    isTravelPolicySetup: Boolean,
    isNonTravelPolicySetup: Boolean,
  },
  companyDetails: companyDetailsSchema,
  employees: [employeeSchema],
  groups:[{
    groupName: String,
    filters: [],
  }],
  policies:{
  },
  groupHeaders:{
  },
  orgHeaders:{
  },
  travelAllocation: [{
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  travelExpenseAllocation: [{
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  nonTravelExpenseAllocation: [{
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  groupingLabels: [{
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  accountLines: [{
    categoryName: String,
    accountLine: String,
  }],
  multiCurrencyTable: 
    {
      defaultCurrency: {},
      exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
    },
  expenseCategories: [
    // {
    //   categoryName: String,
    //   fields: [{name:String, type:String}],
    // },
  ],
  systemRelatedRoles:{
    finance:[],
    businessAdmin:[],
    superAdmin:[],
  },
  blanketDelegations:{
    groups:[{groupName:String, filters:[], canDelegate:Boolean}],
    employees:[],
  },
  advanceSettlementOptions: {Cash:Boolean, Cheque:Boolean, ['Salary Account']:Boolean, ['Prepaid Card']:Boolean, ['NEFT Bank Transfer']:Boolean}, // add options here if its fixed values 
  expenseSettlementOptions: {Cash:Boolean, Cheque:Boolean, ['Salary Account']:Boolean, ['Prepaid Card']:Boolean, ['NEFT Bank Transfer']:Boolean},// add options here if its fixed values 
})

// model from the schema
const HRMaster = mongoose.model('HRMaster', hrCompanySchema)

export default HRMaster