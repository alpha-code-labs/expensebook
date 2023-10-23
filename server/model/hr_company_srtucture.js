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
  basicDetails: basicDetailsSchema,
  contactDetails: contactSchema,
  emergencyContactDetails: {
    mobileNumber: {
        primary: String,
      },
  },
  employmentDetails: {
    companyName: String,
    employeeCode: String,
  },
  group: String, // employee group name (specific to our system) ? can employee have more than one group
})

// assigned manager schema
const temporaryAssignedManagerSchema = new mongoose.Schema({
  assignedFor: String,
  approvals: {
    travelRequest: Boolean,
    cashAdvance: Boolean,
    expenseApproval: Boolean,
  },
})

// delegated schema
const delegatedSchema = new mongoose.Schema({
  delegatedFor: String,
  endDate: Date,
})

//reporting schema 
const reportingSchema = new mongoose.Schema({
  level: String,
  managerName: String,
  managerEmpId: String,
});


// employee schema
const employeeSchema = new mongoose.Schema({
  employeeDetails: employeeDetailsSchema,
  employeeRoles: {
    employee: Boolean,
    employeeManager: Boolean,
    finance: Boolean,
    businessAdmin: Boolean,
    superAdmin: Boolean,
  },
  temporaryAssignedManager: temporaryAssignedManagerSchema,
  delegated: delegatedSchema,
  reportingto: [reportingSchema], 
})

// company details schema
const companyDetailsSchema = new mongoose.Schema({
  companyName: String,
  companyLogo: String,
  companyEmail: String,
  companyHeadquarters: companyHeadquartersSchema,
  companySize: String,
  defaultCurrency: String,// default currency symbol is needed or not here
  industry: String,
})

// HR & Company Structure schema
const hrCompanySchema = new mongoose.Schema({
  tenantId: String,
  DIY_FLAG: Boolean,
  GROUPING_FLAG: Boolean,
  ORG_HEADERS_FLAG: Boolean,
  companyDetails: companyDetailsSchema,
  employees: [employeeSchema],
  groups: {
    groupHeaders: [String],
    groupName: [String],
  },
  departments: [String],// do we need departmentName also
  legalEntities: [String],
  costCenters: [String],
  profitCenters: [String],
  geographicalLocations: [String],
  responsibilityCenters: [String],
  businessUnits: [String],
  divisions: [String],
  projects: [String],
  cashAdvanceOptions: [String], // add options here if its fixed values 
  cashExpenseOptions: [String],// add options here if its fixed values 
})

// model from the schema
const HRCompany = mongoose.model('HRCompany', hrCompanySchema)

export default HRCompany








