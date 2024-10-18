import mongoose from "mongoose"

// employee schema

const employeeSchema = new mongoose.Schema({
  employeeDetails: {}, 
  group: [String],
  travelPreferences:{
    busPreference: {
      seat: String,
      meal: String
    },
    dietaryAllergy: String,
    emergencyContact: {
      contactNumber: String,
      relationship: String
    },
    flightPreference: {
      seat: String,
      meal: String
    },
    hotelPreference: {
      roomType: String,
      bedType: String,
    },
    trainPreference: {
      seat: String,
      meal: String
    }
  },  
  employeeRoles: {
    employee: Boolean,
    employeeManager: Boolean,
    finance: Boolean,
    businessAdmin: Boolean,  //change it to travel admin
    superAdmin: Boolean,
  },
  canDelegate: Boolean,
  imageUrl: String,
})

// company details schema

const companyDetailsSchema = new mongoose.Schema({
  companyName: String,
  companyLogo: String,
  companyEmail: String,
  companyHeadquarters: String,
  companySize: String,
  defaultCurrency: {countryCode: String, fullName: String, shortName: String, symbol: String}, // default currency symbol is needed or not here
  industry: String,
})

const ExchangeValueSchema = new mongoose.Schema({
  currency: {},
  value: Number, // Represents the exchange rate for the entered currency
});

// HR & Company Structure schema
const hrCompanySchema = new mongoose.Schema({
  tenantId: mongoose.Types.ObjectId,
  
  flags:{
    DIY_FLAG: Boolean,
    GROUPING_FLAG: Boolean,
    ORG_HEADERS_FLAG: Boolean,
    POLICY_SETUP_FLAG: Boolean,
  },

  onboardingCompleted: Boolean,
  state: String,
  companyDetails: companyDetailsSchema,
  employees: [employeeSchema],
  groups:[{
    groupName: String,
    filters: [],
  }],
  policies:{
    travelPolicies: {},
    nonTravelPolicies: [],
  },
  groupHeaders:{
  },
  orgHeaders:{
  },
  listOfManagers:[],

  travelAllocationFlags:{
    level1:Boolean,
    level2:Boolean,
    level3:Boolean,
  },

  travelAllocations : {
    //LEVEL1 Structure
		// allocation: [ {headerName:String, headerValues:[String]} ]
		// expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		// allocation_accountLine: String
		// expenseAllocation_accountLine: String

    //LEVEL2 Structure

    // international:{
		// allocation: [ {headerName:String, headerValues:[String]} ]
		// expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		// allocation_accountLine: String
		// expenseAllocation_accountLine: String
		// },

		// domestic:{
    // allocation: [ {headerName:String, headerValues:[String]} ]
		// expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		// allocation_accountLine: String
		// expenseAllocation_accountLine: String
		// },

		// local:{
    // allocation: [ {headerName:String, headerValues:[String]} ]
		// expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		// allocation_accountLine: String
		// expenseAllocation_accountLine: String
		// }


    //LEVEL3 Structure
      // international:[{
      //  categoryName: String,
      //  allocation: [ {headerName:String, headerValues:[String]} ]
      //  expenseAllocation: [ {headerName:String, headerValues:[String]} ]
      //  allocation_accountLine: String
      //  expenseAllocation_accountLine: String
		// }],

		// domestic:[{
    //  categoryName: String,
    //  allocation: [ {headerName:String, headerValues:[String]} ]
		//  expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		//  allocation_accountLine: String
		//  expenseAllocation_accountLine: String
		// }],

		// local:[{
    //  categoryName: String,
    //  allocation: [ {headerName:String, headerValues:[String]} ]
		//  expenseAllocation: [ {headerName:String, headerValues:[String]} ]
		//  allocation_accountLine: String
		//  expenseAllocation_accountLine: String
		// }],

  },

  reimbursementAllocations: [{
    categoryName: String,
    expenseAllocation: [
      {
        headerName: String,
        headerValues: [String]
      }
    ],
    expenseAllocation_accountLine: String,
    fields:[]
  }],

  travelExpenseCategories: [
    //LEVEL1 Structure
    //{ 
    //   categoryName: String, 
		//   fields:[name: String, type: String] 
    // },

    //LEVEL2 and LEVEL3
    //{'international' : [
    //  { 
    //    categoryName: String, 
		//    fields:[name: String, type: String] 
    //  },
    //]}
    //{'domestic' : [
    //  { 
    //    categoryName: String, 
		//    fields:[name: String, type: String] 
    //  },
    //]}
    //{'local' : [
    //  { 
    //    categoryName: String, 
		//    fields:[name: String, type: String] 
    //  },
    //]}

  ],

  reimbursementExpenseCategories: [
    // {
    //   categoryName:String,
    //   fields: [ {name: String, type: String} ]
    // }
  ],

  groupingLabels: [{
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],

  multiCurrencyTable: 
    {
      defaultCurrency: {},
      exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
    },

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
const HRCompany = mongoose.model('HRCompany', hrCompanySchema)

export default HRCompany