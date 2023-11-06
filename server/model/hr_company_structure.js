import mongoose from "mongoose"

// employee schema
const employeeSchema = new mongoose.Schema({
  employeeDetails: {}, //for now it makes sense to make it flexible, extracting groups tag from here
  group: [String], 
  employeeRoles: {
    employee: Boolean,
    employeeManager: Boolean,
    finance: Boolean,
    businessAdmin: Boolean,  //change it to travel admin
    superAdmin: Boolean,
  },
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
  currencyName: String,
  value: Number, // Represents the exchange rate for the entered currency
});

// HR & Company Structure schema
const hrCompanySchema = new mongoose.Schema({
  tenantId: String,
  flags:{
    DIY_FLAG: Boolean,
    GROUPING_FLAG: Boolean,
    ORG_HEADERS_FLAG: Boolean,
  },
  companyDetails: companyDetailsSchema,
  employees: [employeeSchema],
  groups:[{
    groupName: String,
    employees: [],
    canDelegate:[],
  }],
  policies:{
    policyStructure:{},
    ruleEngine:{}
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
  expenseCategories: [{
    categoryName: String,
    categoryValues: [String],
  }],
  accountLines: [{
    categoryName: String,
    accountLine: String,
  }],
  multiCurrencyTable: [
    {
      currencyName: String,
      exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
    },
  ],
  cashAdvanceOptions: [String], // add options here if its fixed values 
  cashExpenseOptions: [String],// add options here if its fixed values 
})

// model from the schema
const HRCompany = mongoose.model('HRCompany', hrCompanySchema)

export default HRCompany