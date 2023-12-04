// import mongoose from "mongoose"

// const fixedOrgHeaders = {
//     "Legal Entity Container": String,
//     "Cost Centre Container": String,
//     "Profit Centre Container": String,
//     "Department Container": String,
//     "Business Unit Container": String,
//     "Geography Locations Container": String,
//     "Divisions Container": String,
//     "Projects Container": String,
//     "Responsibility Centre Container": String,
//   };
  
//   // To Create a schema for the custom organization headers without specifying their data types.
//   const customOrgHeadersSchema = {
//     type: mongoose.Schema.Types.Mixed,
//   };
  
//   const orgHeadersSchema = new mongoose.Schema({
//     ...fixedOrgHeaders,
//     ...customOrgHeadersSchema,
//   });

// // employee schema
// const employeeSchema = new mongoose.Schema({
//   employeeDetails: {}, //for now it makes sense to make it flexible, extracting groups tag from here
//   group: String, 
//   employeeRoles: {
//     employee: Boolean,
//     employeeManager: Boolean,
//     finance: Boolean,
//     travelAdmin: Boolean,  //Old name Business admin
//     superAdmin: Boolean,
//   },
// })

// // company details schema
// const companyDetailsSchema = new mongoose.Schema({
//   companyName: String,
//   companyLogo: String,
//   companyEmail: String,
//   companyHeadquarters: String,
//   companySize: String,
//   defaultCurrency: String, // default currency symbol is needed or not here
//   industry: String,
// })

// const ExchangeValueSchema = new mongoose.Schema({
//   currencyName: String,
//   value: Number, // Represents the exchange rate for the entered currency
// });

// // HR & Company Structure schema
// const mod = new mongoose.Schema({
//   tenantId: String,
//   tenantName: String,
//   CompanyName: String,
//   flags:{
//     DIY_FLAG: Boolean,
//     GROUPING_FLAG: Boolean,
//     ORG_HEADERS_FLAG: Boolean,
//   },
//   companyDetails: companyDetailsSchema,
//   employees: [employeeSchema],
//   groups:{
//     groupHeaders: [String],
//     groupName: [String],
//   },
//   policies:{},
//   groupHeaders:{
//     grades: [String],
//     bands:[String],
//     designations: [String],
//   },
//   orgHeaders:orgHeadersSchema,
//   travelAllocation: [{
//     headerName: {
//       type: String,
//     },
//     headerValues: [{
//       type: String,
//     }],
//   }],
//   travelExpenseAllocation: [{
//     headerName: {
//       type: String,
//     },
//     headerValues: [{
//       type: String,
//     }],
//   }],
//   nonTravelExpenseAllocation: [{
//     headerName: {
//       type: String,
//     },
//     headerValues: [{
//       type: String,
//     }],
//   }],
//   expenseCategories: [{
//     categoryName: String,
//     categoryValues: [String],
//   }],
//   accountLines: [{
//     categoryName: String,
//     accountLine: String,
//   }],
//   multiCurrencyTable: [
//     {
//       currencyName: String,
//       exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
//     },
//   ],
//   cashAdvanceOptions: [String], // add options here if its fixed values 
//   cashExpenseOptions: [String],// add options here if its fixed values 
// })

// //
// const miscFromOnboarding = mongoose.model('miscFromOnboarding', mod)

// export default miscFromOnboarding