import mongoose from 'mongoose';


const travelRequestStatusEnums = [
    'draft',
    'pending approval',
    'approved',
    'rejected',
    'pending booking',
    'booked',
    'transit',
    'canceled',  
]

const travelRequestStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
  'section 4',
  'section 5'
]

//not yet fixed
const travelAndNonTravelPoliciesSchema = new mongoose.Schema({
  travelPolicy: {
      InternationalPolicy: {},
      domesticPolicy: {},
      localPolicy: {}
  },
  nonTravelPolicy: {}
})


//not yet fixed
const itinerarySchema = ({
  cities: [{from:String, to:String, departure: {date:String, time:String}, return: {date:String, time:String}}],
  hotels: [{class:String, checkIn:String, checkOut:String}],
  cabs: [],
  modeOfTransit:String,
  travelClass: String,
  needsVisa:Boolean,
  needsAirportTransfer:Boolean,
  needsHotel:Boolean,
  needsFullDayCabs:Boolean,
  tripType:{oneWayTrip:Boolean, roundTrip:Boolean, multiCityTrip:Boolean}
})

const travelViolationsSchema =({
  cities: String,
  hotels: String,
  cabs: String,
  modeOfTransit:String,
  travelClass: String,
  needsVisa:String,
  needsAirportTransfer:String,
  needsHotel:String,
  needsFullDayCabs:String,
  tripType:{oneWayTrip:String, roundTrip:String, multiCityTrip:String}
})

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
];

const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
];

//Not yet fixed , need to be discussed and added into schema
// const expenseTypeEnums = {
//   Utilities: "Utilities",
//   EquipmentMaintenance: "Equipment Maintenance",
//   Subscriptions: "Subscriptions",
//   ProfessionalDevelopment: "Professional Development",
//   OfficeRent: "Office Rent",
//   Communication: "Communication",
//   Insurance: "Insurance",
//   OfficeCleaning: "Office Cleaning",
//   MarketingAndAdvertising: "Marketing and Advertising",
//   EmployeeBenefits: "Employee Benefits",
//   OfficeFurniture: "Office Furniture",
//   LegalAndAccountingServices: "Legal and Accounting Services",
//   OfficeSecurity: "Office Security",
//   Miscellaneous: "Miscellaneous"
// };


const isProduction = process.env.NODE_ENV === 'production';

// Define constant enums for status values
const approvalStatusEnums = ['draft', 'pending approval', 'approved', 'rejected', 'null'];
const approvalTypesEnums = ['travel and cash advance', 'travel-expense', 'non-travel-expense'];

// Define constant enums for expenseStatus and expenseHeaderType
const expenseStatusEnums = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'pending payment',
  'paid',
  'paid and distributed',
];


const expenseHeaderTypeEnums = ['travel', 'non travel'];
 
const travelRequestSchema = new mongoose.Schema({
  tenantId: {
  type: String,
  required: true,
},
travelRequestId: {
  type: String, 
  required: true,
  unique: true,
},
tripPurpose: {
  type: String,
  required: true,
},
travelRequestStatus: { //initialize with status as 'draft'
  type: String,
  enum: travelRequestStatusEnums,
  required: true,
},
travelRequestState: { //initialize with state as 'section 0'
  type: String,
  enum: travelRequestStateEnums,
  required: true,
},
createdBy:{
  type: {empId: String, name: String},  //employee Id by whom TR is raised
  required: true
},
createdFor: {
  type: [{empId: String, name: String}], //employee Id's for whom TR is raised
  required: true
},
teamMembers:{
  type: [{empId: String, name: String}], //employee Id's for whom TR is raised
},
travelAllocationHeaders: [
  {
    department: String,
    percentage: Number,
  },
],
itinerary: itinerarySchema,
travelDocuments: [String],
bookings: [
  {
    vendorName: String,
    billNumber: String,
    billDescription: String,
    grossAmount: Number,
    taxes: Number,
    date: String,
    imageUrl: String,
  },
],
approvers: [
  {
      empId: String,
      name: String
  }
],
preferences: [String],
travelViolations: travelViolationsSchema,
travelRequestDate: {
  type: String,
  required:true
},
travelBookingDate: String,
travelCompletionDate: String,
travelRequestRejectionReason: String,
travelAndNonTravelPolicies: travelAndNonTravelPoliciesSchema,
})



const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)


  // Define the Cash Advance schema with a reference to Travel Request
  const cashAdvanceSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      required: true,
    },
    travelRequestId: {
      type: process.env.NODE_ENV === 'production' ? mongoose.Schema.Types.ObjectId : String,
      ref: 'TravelRequest',
      unique: true,
    },
    cashAdvanceId: {
      type : String,
      unique: true,
      required:true,
    },
    createdBy:{
      type: {empId: String, name: String},  //employee Id by whom TR is raised
      required: true,
    },
    cashAdvanceStatus: {
      type: String,                  
      enum: cashAdvanceStatusEnum,
      required: true,
    },
    cashAdvanceState: {
      type: String,
      enum: cashAdvanceStateEnums,
      required: true,
    },
    amountDetails: [
      {
        amount: Number,
        currency: String,
        mode: String,
      },
    ],
    approvers: [
      {
          empId: String,
          name: String
      }
    ],
    cashAdvanceRequestDate: Date,
    cashAdvanceApprovalDate: Date,
    cashAdvanceSettlementDate: Date,
    cashAdvanceViolations: [String],
    cashAdvanceRejectionReason: String,
    additionalCashAdvanceField: String,
  });
  
  // Create the Cash Advance model
const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);


const expenseLineSchema = new mongoose.Schema({
    transactionData: {
      businessPurpose: String,
      vendorName: String,
      billNumber: String,
      billDate:String,
      grossAmount: Number,
      taxes: Number,
      totalAmount: Number,
      description: String,
    },
    expenseType: String,
    billRejectionReason: String,
    personalExpense: Boolean,
    modeOfPayment: String,
    billImageUrl: String,
  });
  
  
const expenseSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  expenseHeaderID: {
    type: String,
    required: true,
  },
  travelRequestId: String,
  expenseHeaderType: {
    type: String,
    enum: expenseHeaderTypeEnums,
  },
  tripPurpose: {
    type: String,
  },
  purpose:{
    type: String,
  },
  approvedCashAdvance: [
    {
      amount: Number,
      currency: String,
      mode: String,
    },
  ],
  createdBy:{
    type: {empId: String, name: String},  //employee Id by whom Expense is raised
    required: true
  },
  createdFor: {
    type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
    required: true
  },
  teamMembers:{
    type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
  },
  expenseStatus: {
    type: String,
    enum: expenseStatusEnums,
  },
  expenseSubmissionDate: Date,
  expenseLines: [expenseLineSchema],
  approvers: [
    {
        empId: String,
        name: String
    }
  ],
  expenseViolations: [String],
  expenseRejectionReason: String,
});
  

  
  const Expense = mongoose.model('Expense', expenseSchema);
  
  export default Expense;
  
  const approvalSchema = new mongoose.Schema({
    approvalType: {
        type: String,
        enum: approvalTypesEnums,
       },
    approvalStatus: { 
        type: String,
        enum: approvalStatusEnums,
      }, 
    embeddedTravelRequest: travelRequestSchema,
    embeddedCashAdvance: cashAdvanceSchema ,
    embeddedExpenseSchema: expenseSchema,
    notificationSentToDashboardFlag: Boolean,
  });
  
  
  const Approval = mongoose.model('Approval', approvalSchema);
  
  export { TravelRequest, CashAdvance, Expense, Approval };








//  tenantID: String,
//     approvalID: {
//       type: isProduction ? mongoose.Schema.Types.ObjectId : String,
//     },
//     approvalType: {
//       type: String,
//       enum: approvalTypesEnums,
//     },
//     travelRequest: {
//       travelRequestId: {
//         type: isProduction ? mongoose.Schema.Types.ObjectId : String,
//       },
//       travelRequestStatus: {
//         type: String,
//         enum: approvalStatusEnums,
//       },
//       travelRequestRejectionReason: String,
//     },
//     cashAdvance: {
//       cashAdvanceId: {
//         type: isProduction ? mongoose.Schema.Types.ObjectId : String,
//       },
//       cashAdvanceStatus: {
//         type: String,
//         enum: approvalStatusEnums,
//       },
//       cashAdvanceRejectionReason: String,
//     },
//     expense: {
//       expenseID: {
//         type: isProduction ? mongoose.Schema.Types.ObjectId : String,
//       },
//       expenseStatus: {
//         type: String,
//         enum: approvalStatusEnums,
//       },
//       expenseRejectionReason: String,
//     },
