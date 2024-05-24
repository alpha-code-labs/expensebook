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
  'pickup',
  'drop',
] 

const itinerarySchema = {
  flights: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      from: String,
      to: String,
      date: Date,
      returnDate: Date,
      time: String,
      returnTime: String,
      travelClass: String,
      isReturnTravel: Boolean,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_from: String,
      bkd_to: String,
      bkd_date: Date,
      bkd_returnDate: String,
      bkd_time: String,
      bkd_returnTime: String,
      bkd_travelClass: String,
      bkd_violations: {
        class: String,
        amount: String,
      },
      modified: Boolean,
      cancellationDate: Date,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
    },
  ],

  buses: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      from: String,
      to: String,
      date: Date,
      time: String,
      travelClass: String,
      isReturnTravel: Boolean,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_from: String,
      bkd_to: String,
      bkd_date: Date,
      bkd_time: String,
      bkd_travelClass: String,
      modified: Boolean,
      cancellationDate: Date,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
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
    },
  ],

  trains: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      from: String,
      to: String,
      date: Date,
      time: String,
      travelClass: String,
      isReturnTravel: Boolean,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_from: String,
      bkd_to: String,
      bkd_date: Date,
      bkd_time: String,
      bkd_travelClass: String,
      bkd_violations: {
        class: String,
        amount: String,
      },
      modified: Boolean,
      cancellationDate: Date,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
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
    },
  ],

  hotels: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      location: String,
      locationPreference: String,
      class: String,
      checkIn: Date,
      checkOut: Date,
      checkInTime: String,
      checkOutTime: String,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_location: String,
      bkd_locationPreference: String,
      bkd_class: String,
      bkd_checkIn: Date,
      bkd_checkOut: Date,
      bkd_checkInTime: String,
      bkd_checkOutTime: String,
      bkd_violations: {
        class: String,
        amount: String,
      },
      modified: Boolean,
      cancellationDate: String,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
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
    },
  ],

  cabs: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      date: Date,
      class: String,
      time: String,
      pickupAddress: String,
      dropAddress: String,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_date: Date,
      bkd_class: String,
      bkd_time: String,
      bkd_pickupAddress: String,
      bkd_dropAddress: String,
      bkd_violations: {
        class: String,
        amount: String,
      },
      modified: Boolean,
      cancellationDate: String,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
      type: {
        type: String,
        enum: transferEnums,
      },
    },
  ],

  carRentals: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      date: Date,
      class: String,
      time: String,
      pickupAddress: String,
      dropAddress: String,
      violations: {
        class: String,
        amount: String,
      },
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
      bkd_date: Date,
      bkd_class: String,
      bkd_time: String,
      bkd_pickupAddress: String,
      bkd_dropAddress: String,
      bkd_violations: {
        class: String,
        amount: String,
      },
      modified: Boolean,
      cancellationDate: String,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
      type: {
        type: String,
        enum: transferEnums,
      },
    },
  ],

  personalVehicles: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      date: Date,
      time: String,
      from: String,
      to: String,
      modified: Boolean,
      cancellationDate: String,
      cancellationReason: String,
      rejectionReason: String,
      status: { type: String, enum: itineraryStatusEnums },
      bookingDetails: {
        docURL: String,
        docType: String,
        billDetails: {
          vendorName: String,
          taxAmount: String,
          totalAmount: String,
        },
      },
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
      type: {
        type: String,
      },
    },
  ],
};

const formDataSchema = {
  isReturnTravel: Boolean,
  itinerary: [
    {
      formId: String,
      mode : String,
      from : String,
      to : String,
      date: String,
      returnDate: String,
      hotelNights: String,
      pickUpNeeded: Boolean,
      dropNeeded: Boolean,
      fullDayCabs: Number,
      fullDayCabDates: [String],
      dateError:{set: Boolean, message:String},
      returnDateError:{set: Boolean, message:String},
      fromError: {set: Boolean, message:String},
      toError: {set: Boolean, message:String},
   },
],
};

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
  formData: formDataSchema,
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
    type: Date,
    required:true
    },
    travelType: String,
  assignedTo:{empId: String, name: String},
  bookedBy:{empId: String, name: String},
  recoveredBy:{empId: String, name: String},
  travelBookingDate: date,
  travelCompletionDate: date,
  travelRequestRejectionReason: String,
  cancellationDate:date,
  cancellationReason:String,
  rejectionReason: String,
  rejectionDate: Date,
  isCashAdvanceTaken: Boolean,
  isCancelled:Boolean,
  isAddALeg:Boolean,
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
 