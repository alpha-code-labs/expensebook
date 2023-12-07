import mongoose from 'mongoose'

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
  'canceled',  
];

const itinerarySchema = ([
  {
  departure:{
    itineraryId: mongoose.Schema.ObjectId,
    from: String,
    to: String,
    date: String,
    time: String,
    bkd_from: String,
    bkd_to: String,
    bkd_date: String,
    bkd_time: String,
    modified: Boolean,
    isCancelled: Boolean,
    cancellationDate: Date,
    cancellationReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  },

  return:{
    itineraryId: mongoose.Schema.ObjectId,
    from: String,
    to: String,
    date: String,
    time: String,
    bkd_from: String,
    bkd_to: String,
    bkd_date: String,
    bkd_time: String,
    modified: Boolean,
    isCancelled: Boolean,
    cancellationDate: Date,
    cancellationReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  },

  hotels:[{
    location:String,
    class:String, 
    checkIn:String, 
    checkOut:String,
    violations:{
      class: String,
      amount: String,
    }, 
    bkd_location: String,
    bkd_class:String,
    bkd_checkIn:String,
    bkd_checkOut:String,
    bkd_violations:{
      class: String,
      amount: String,
    },
    modified:Boolean, 
    isCancelled:Boolean, 
    cancellationDate:String,
    cancellationReason:String, 
    status:String, 
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  }],

  cabs:[{
    date:String, 
    class:String, 
    preferredTime:String, 
    pickupAddress:String, 
    dropAddress:String, 
    violations:{
      class: String,
      amount: String,
    }, 
    bkd_date:String,
    bkd_class:String,
    bkd_preferredTime:String,
    bkd_pickupAddress:String,
    bkd_dropAddress:String,

    modified:Boolean, 
    isCancelled:Boolean, 
    cancellationDate:String, 
    cancellationReason:String,
    status:String, 
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  }],

  modeOfTransit:String,
  travelClass:String,
  needsVisa:Boolean,
  needsBoardingTransfer:Boolean,
  needsHotelTransfer:Boolean,

  boardingTransfer:{
    date:String, 
    class:String, 
    preferredTime:String, 
    pickupAddress:String, 
    dropAddress:String, 
    violations:{
      class: String,
      amount: String,
    }, 
    bkd_date:String,
    bkd_class:String,
    bkd_preferredTime:String,
    bkd_pickupAddress:String,
    bkd_dropAddress:String,

    modified:Boolean, 
    isCancelled:Boolean, 
    cancellationDate:String, 
    cancellationReason:String,
    status:String, 
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    } 
  },

  hotelTransfer:{
    date:String, 
    class:String, 
    preferredTime:String, 
    pickupAddress:String, 
    dropAddress:String, 
    violations:{
      class: String,
      amount: String,
    }, 
    bkd_date:String,
    bkd_class:String,
    bkd_preferredTime:String,
    bkd_pickupAddress:String,
    bkd_dropAddress:String,

    modified:Boolean, 
    isCancelled:Boolean, 
    cancellationDate:String,
    cancellationReason:String, 
    status:String, 
    status:{type:String, enum:itineraryStatusEnums},
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  },

  needsHotel:Boolean,
  needsCab:Boolean,
  isCancelled: Boolean,
  cancellationDate: String,
  cancellationReason: String,
  status: {type:String, enum:itineraryStatusEnums},
  itineraryId: mongoose.Schema.ObjectId, 
  }
])

export const travelRequestSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName:{
    type: String,
  },
  companyName:{
    type: String,
  },
  travelRequestId: {
    type: mongoose.Schema.Types.ObjectId,
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
  isCashAdvanceTaken: Boolean,
  sentToTrip:Boolean,
})

// const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)

