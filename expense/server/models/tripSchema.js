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

const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];

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

const cashAdvanceStateEnums = [
    'section 0',
    'section 1',
  ];

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
];

const tripStatusEnum = [
  'upcoming',
  'modification',
  'transit',
  'completed',
  'cancelled',
];

 
const travelRequestSchema = new mongoose.Schema({
tenantId: {
  type: String,
  required: true,
},
tenantName: {
  type: String,
},
companyName: {
  type: String,
},
travelRequestId: {
  type: String, 
  // required: true,
  // unique: true,
},
tripPurpose: {
  type: String,
  // required: true,
},
travelRequestStatus: { //initialize with status as 'draft'
  type: String,
  enum: travelRequestStatusEnums,
  // required: true,
},
travelRequestState: { //initialize with state as 'section 0'
  type: String,
  enum: travelRequestStateEnums,
  // required: true,
},
createdBy:{
    empId: String,
    name: String,
  },
createdFor: {
    empId: String,
    name: String,
  },
teamMembers:{
  type: [{empId: String, name: String}], //employee Id's for whom TR is raised
},
isCashAdvanceTaken: Boolean,
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
    name: String,
    status: {
      type: String,
      enum: approverStatusEnums,
    },
  }
],
preferences: [String],
travelViolations: travelViolationsSchema,
travelRequestDate: {
  type: String,
  // required:true
},
travelBookingDate: String,
travelCompletionDate: String,
travelRequestRejectionReason: String,
travelAndNonTravelPolicies: travelAndNonTravelPoliciesSchema,
})

// // Create the Travel Request model
// const TravelRequest = mongoose.model('TravelRequest', travelRequestSchema);

// Define the Cash Advance schema with a reference to Travel Request
const cashAdvanceSchema = new mongoose.Schema({
    tenantId: {
      type: String,
      // required: true,
    },
    tenantName: {
      type: String,
    },
    companyName: {
      type: String,
    },
    travelRequestId: {
        type: String,
      },
    embeddedTravelRequest:  {
        type: travelRequestSchema, 
        // required: true,
      },
    cashAdvances: [
      {
        tenantId: {
          type: String,
          // required: true,
        },
        travelRequestId: {
          type: String,
          // required: true,
        },
        cashAdvanceId: {
          type: String,
          // unique: true,
          // required: true,
        },
        createdBy: {
            empId: String,
            name: String,
        },
        cashAdvanceStatus: {
          type: String,
          enum: cashAdvanceStatusEnum,
          // required: true,
          default: 'draft',
        },
        cashAdvanceState: {
          type: String,
          enum: cashAdvanceStateEnums,
          default: 'section 0',
          // required: true,
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
            name: String,
            status: {
              type: String,
              enum: approverStatusEnums,
            },
          },
        ],
        cashAdvanceRequestDate: Date,
        cashAdvanceApprovalDate: Date,
        cashAdvanceSettlementDate: Date,
        cashAdvanceViolations: [String],
        cashAdvanceRejectionReason: String,
      },
    ],
  });

// // Create the Cash Advance model
 //const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    // required: true,
  },
  userId:{
    empId: String,
    name: String},
  tripPurpose:{
    type: String,
  },
  tripStatus: {
    type: String,
    enum: tripStatusEnum,
    // required: true,
  },
  tripStartDate: {
    type: Date,
    // required: true,
  },
  tripCompletionDate: {
    type: Date,
    // required: true,
  },
  notificationSentToDashboardFlag: Boolean,

  // Embedded documents for quick access
  embeddedTravelRequest: travelRequestSchema,
  embeddedCashAdvance: cashAdvanceSchema,
}); 

// // Create the Trip model
//const Trip = mongoose.model('Trip', tripSchema);

export { tripSchema };
 