import mongoose from 'mongoose'

const travelRequestStatusEnums = [
    'draft', 
    'pending approval', 
    'approved', 
    'rejected', 
    'pending booking', 
    'booked',
    'transit', 
    'paid and cancelled',
    'recovered',
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

export const itinerarySchema = (
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
    bkd_locationPreference:String,
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

export const travelRequestSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    // required: true,
  },
  tenantName:{
    type: String,
  },
  companyName:{
    type: String,
  },
  travelRequestId: {
    type: mongoose.Types.ObjectId, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
    required: true,
    // unique: true,
  },
  travelRequestNumber: {
    type: String, // eg. TRAM000001
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
  assignedTo:{empId: String, name: String},
  bookedBy:{empId: String, name: String},
  recoveredBy:{empId: String, name: String},
  travelBookingDate: date,
  travelCompletionDate: date,
  travelRequestRejectionReason: String,
  cancellationDate:date,
  cancellationReason:String,
  isCashAdvanceTaken: Boolean,
  isCancelled:Boolean,
  sentToTrip:Boolean,
})


// travelRequestSchema.pre('save', function (next) {
//   // Generate a new ObjectId and set it for each section if not already there
  
//   if(!this.travelRequestId) this.travelRequestId = new mongoose.Types.ObjectId()

//   this.itinerary.forEach(item=>{
//     if(!item.departure.itineraryId) item.departure.itineraryId = new mongoose.Types.ObjectId();
//     if(!item.return.itineraryId) item.return.itineraryId = new mongoose.Types.ObjectId();
//     // Set a unique itineraryId for each hotel
//     item.hotels.forEach(hotel => {
//       if(!hotel.itineraryId) hotel.itineraryId = new mongoose.Types.ObjectId();
//     });
//     // Set a unique itineraryId for each cab
//     item.cabs.forEach(cab => {
//       if(!cab.itineraryId) cab.itineraryId = new mongoose.Types.ObjectId();
//     });
//   })
  
//   // Continue with the save operation
//   next();
// });


// travelRequestSchema.pre('validate', function (next){
//   if (!travelRequestStatusEnums.includes(this.travelRequestStatus)) {
//     // If status is not in the enum, throw a validation error
//     next(new Error('Invalid travel request status'));
//   } else {
//     // Continue with the validation
//     next();
//   }
// })

// travelRequestSchema.pre('validate', function (next){
//   if (!travelRequestStateEnums.includes(this.travelRequestState)) {
//     // If status is not in the enum, throw a validation error
//     next(new Error('Invalid travel request state'));
//   } else {
//     // Continue with the validation
//     next();
//   }
// })

// const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)
 