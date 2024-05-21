import mongoose from "mongoose"

//  company headquarters
const companyHeadquartersSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
})

// Contact Details schema
const contactSchema = new mongoose.Schema({
    phoneNumber: String,// here just check phoneNumber and MobileNumber needed
    mobileNumber: {
      primary: String,
      secondary: String,
    },
    emailId: String,
  })
//basic details schema
const basicDetailsSchema = new mongoose.Schema({
  band: String,
  citizenship: String,
  costCenterSourceCode: String,
  designationName: String,
  designationSourceCode: String,
  employeeCategory: String,
  employeeCategorySourceCode: String,
  grade: String,
  legalEntity: String,
  costCenter: String,
  profitCenter: String,
  department: String,
  businessUnit: String,
  geographicalLocation: String,
  division: String,
  project: String,
  responsibilityCenter: String,
  joiningDate: Date,
})

//employee details schema
const employeeDetailsSchema = new mongoose.Schema({
  employeeId: String,
  basicDetails: {}, //for now making it flexible removed basicDetailsSchema
  group: [String], // going with multiple groups for now
})

//temporary assigned manager schema
/*
const temporaryAssignedManagerSchema = new mongoose.Schema({
  assignedFor: String,
  approvals: {
    travelRequest: Boolean,
    cashAdvance: Boolean,
    expenseApproval: Boolean,
  },
})
*/ // not needed for now

// delegated schema
// const delegatedSchema = new mongoose.Schema({
//   delegatedFor: String,
//   endDate: Date,
// })
//not needed for now

//reporting schema 
const reportingSchema = new mongoose.Schema({
  level: String,
  managerName: String,
  managerEmpId: String,
});


// employee schema
const employeeSchema = new mongoose.Schema({
  employeeDetails: {}, //for now it makes sense to make it flexible, extracting groups tag from here
  group: String, 
  employeeRoles: {
    employee: Boolean,
    employeeManager: Boolean,
    finance: Boolean,
    businessAdmin: Boolean,  //change it to travel admin
    superAdmin: Boolean,
  },
 // temporaryAssignedManager: temporaryAssignedManagerSchema, 
 // not needed for now
 // delegated: delegatedSchema, // not needed for now
 // reportingto: [reportingSchema], //not needed for now 
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

const ExpenseCategorySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  expenseCategories: [
    {
      HeadersName: String,
      values: [String],
    },
  ],
})

const MultiCurrencySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  currencyTable: [
    {
      currencyName: String,
      exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
    },
  ],
});

const travelAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  travelAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})

const travelExpenseAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  travelExpenseAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})

const nonTravelExpenseAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  nontravelExpenseAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})


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
  /*groups:{
    groupHeaders: [String],
    groupName: [String],
  },*/ // not needed for now will do this in gorups and policy container
  groupHeaders:{
    grades: [String],
    bands:[String],
    designations: [String],
  },

  orgHeaders:{
    //departments: [String],// do we need departmentName also
    //legalEntities: [String],
    //costCenters: [String],
    //profitCenters: [String],
    //geographicalLocations: [String],
    //responsibilityCenters: [String],
    //businessUnits: [String],
    //divisions: [String],
    //projects: [String],
  },

  cashAdvanceOptions: [String], // add options here if its fixed values 
  cashExpenseOptions: [String],// add options here if its fixed values 

  MultiCurrencySchema: MultiCurrencySchema,
  ExpenseCategorySchema: ExpenseCategorySchema,
  travelAllocationSchema: travelAllocationSchema,
  travelExpenseAllocationSchema: travelExpenseAllocationSchema,
  nonTravelExpenseAllocationSchema: nonTravelExpenseAllocationSchema,
  companyHeadquarters: companyHeadquartersSchema,
})

// model from the schema
const HRCompany = mongoose.model('HRCompany', hrCompanySchema)

export default HRCompany







