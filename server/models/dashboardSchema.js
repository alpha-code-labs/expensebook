import mongoose from "mongoose";
// import { expenseSchema } from './expenseSchema.js';

const travelRequestStatusEnums = [
  'draft', 
  'pending approval', 
  'approved', 
  'rejected', 
  'pending booking', 
  'booked',
  'transit', 
  'cancelled',  
] 

const travelRequestStateEnums = [
  'section 0', 
  'section 1', 
  'section 2', 
  'section 3', 
]

const approverStatusEnums = [
'pending approval',
'approved',
'rejected',
];


const itineraryStatusEnums = [
'draft', 
'pending approval', 
'approved', 
'rejected', 
'pending booking', 
'booked',
'cancelled',
'paid and cancelled',
'intransit',
'upcoming',  
];

const transferEnums = [
'regular',
'departure pickup',
'departure drop',
'return pickup',
'return drop',
] 

const itinerarySchema = (
{
 formState:[{
  formId:String,
  transfers:{
    needsDeparturePickup:Boolean,
    needsDepartureDrop:Boolean,
    needsReturnPickup:Boolean,
    needsReturnDrop:Boolean,
  },
  needsHotel:Boolean,
  needsCab:Boolean,
  needsVisa:Boolean,
  cancellationDate: String,
  cancellationReason: String,
  formStatus:String,
}],

flights:[{
  itineraryId: mongoose.Schema.ObjectId,
  formId:String,
  from: String,
  to: String,
  date: String,
  time: String,
  travelClass:String,
  isReturnTravel:String,
  violations:{
    class: String,
    amount: String,
  }, 
  bkd_from: String,
  bkd_to: String,
  bkd_date: String,
  bkd_time: String,
  bkd_travelClass:String,
  bkd_isReturnTravel:String,
  bkd_violations:{
    class: String,
    amount: String,
  },
  modified: Boolean,
  cancellationDate: Date,
  cancellationReason: String,
  status:{type:String, enum:itineraryStatusEnums},
  bookingDetails:{
    docURL: String,
    docType: String,
    billDetails: {}, 
  }
}],

buses:[{
  itineraryId: mongoose.Schema.ObjectId,
  formId:String,
  from: String,
  to: String,
  date: String,
  time: String,
  travelClass:String,
  isReturnTravel:String,
  violations:{
    class: String,
    amount: String,
  }, 
  bkd_from: String,
  bkd_to: String,
  bkd_date: String,
  bkd_time: String,
  bkd_travelClass:String,
  bkd_isReturnTravel:String,
  modified: Boolean,
  cancellationDate: Date,
  cancellationReason: String,
  status:{type:String, enum:itineraryStatusEnums},
  bookingDetails:{
    docURL: String,
    docType: String,
    billDetails: {}, 
  }
}],

trains:[{
  itineraryId: mongoose.Schema.ObjectId,
  formId:String,
  from: String,
  to: String,
  date: String,
  time: String,
  travelClass:String,
  isReturnTravel:String,
  violations:{
    class: String,
    amount: String,
  }, 
  bkd_from: String,
  bkd_to: String,
  bkd_date: String,
  bkd_time: String,
  bkd_travelClass:String,
  bkd_isReturnTravel:String,
  bkd_violations:{
    class: String,
    amount: String,
  },
  modified: Boolean,
  cancellationDate: Date,
  cancellationReason: String,
  status:{type:String, enum:itineraryStatusEnums},
  bookingDetails:{
    docURL: String,
    docType: String,
    billDetails: {}, 
  }
}],

hotels:[{
  itineraryId: mongoose.Schema.ObjectId,
  formId:String,
  location:String,
  locationPreference:String,
  class:String, 
  checkIn:String, 
  checkOut:String,
  violations:{
    class: String,
    amount: String,
  }, 
  bkd_location:String,
  bkd_class:String,
  bkd_checkIn:String,
  bkd_checkOut:String,
  bkd_violations:{
    class: String,
    amount: String,
  },
  modified:Boolean,  
  cancellationDate:String,
  cancellationReason:String, 
  status:{type:String, enum:itineraryStatusEnums},
  bookingDetails:{
    docURL: String,
    docType: String,
    billDetails: {}, 
  }
}],

cabs:[{
  itineraryId: mongoose.Schema.ObjectId,
  formId:String,
  date:String, 
  class:String, 
  preferredTime:String, 
  pickupAddress:String, 
  dropAddress:String,
  isReturnTravel:String,
  violations:{
    class: String,
    amount: String,
  }, 
  bkd_date:String,
  bkd_class:String,
  bkd_preferredTime:String,
  bkd_pickupAddress:String,
  bkd_dropAddress:String,
  bkd_isReturnTravel:String,
  bkd_violations:{
    class: String,
    amount: String,
  },
  modified:Boolean, 
  cancellationDate:String, 
  cancellationReason:String,
  status:{type:String, enum:itineraryStatusEnums},
  bookingDetails:{
    docURL: String,
    docType: String,
    billDetails: {}, 
  },
  type:{
    type:String,
    enum:transferEnums,
  }
}],
}
)

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
  
const dashboardSchema = new mongoose.Schema({
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
    tripId: {
      type: String,
      required: true,
    },
    userId: {
      empId: String,
      name: String,
      },
    tripPurpose:{
      type: String,
    },
    tripStatus: {
      type: String,
      enum: tripStatusEnum,
      required: true,
    },
    tripStartDate: {
      type: Date,
      required: true,
    },
    tripCompletionDate: {
      type: Date,
      required: true,
    },
    isSentToExpense: Boolean, 
    notificationSentToDashboardFlag: Boolean,
    travelRequestId: {
      type: String, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
      required: true,
      // unique: true,
    },
    tripPurpose: {
      type: String,
      required: true,
    },
    travelRequestStatus: { //initialize with status as 'draft'
      type: String,
      enum: travelRequestStatusEnums,
      default: 'draft',
      required: true,
    },
    travelRequestState: { //initialize with state as 'section 0'
      type: String,
      enum: travelRequestStateEnums,
      default: 'section 0',
      required: true,
    },
    createdBy:{
      type: {empId: String, name: String},  //employee Id by whom TR is raised 
      required: true
    },
    createdFor: {
      type: {empId: String, name: String}, //employee Id for whom TR is raised
      required: false
    },
    teamMembers: [],
    travelAllocationHeaders: [],
    itinerary: itinerarySchema,
    tripType:{oneWayTrip:Boolean, roundTrip:Boolean, multiCityTrip:Boolean},
    travelDocuments: [String],
    bookings: [
      {
        itineraryReference:{},
        docURL:String,
        details:{},
        status:{},
      },
    ],
    approvers: [{
      empId: String, 
      name: String,  
      status: {
      type: String,
      enum: approverStatusEnums,
    },
    },],
   
    preferences: [String],
    travelViolations: {},
    travelRequestDate: {
      type: String,
      required:true
    },
    travelBookingDate: String,
    travelCompletionDate: String,
    travelRequestRejectionReason: String,
    isCancelled:Boolean,
    cancellationDate:String,
    cancellationReason:String,
    isCashAdvanceTaken: String,
    sentToTrip:Boolean,
    cashAdvances: [
      {
        tenantId: {
          type: String,
          // required: true,
        },
        travelRequestId: {
          // type: mongoose.Schema.Types.ObjectId,
          type: String,
          // required: true,
        },
        cashAdvanceId: {
          // type: mongoose.Schema.Types.ObjectId,
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
    // embeddedExpense: expenseSchema,
  }); 

const dashboard = mongoose.model('dashboardNew', dashboardSchema);

export default dashboard 