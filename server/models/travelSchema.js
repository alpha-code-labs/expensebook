import mongoose from "mongoose";

const travelRequestStatusEnums = [
  "draft",
  "pending approval",
  "approved",
  "rejected",
  "pending booking",
  "booked",
  "transit",
  "cancelled",
  "recovered",
  "paid and cancelled",
  "closed",
  "completed"
];

const travelRequestStateEnums = [
  "section 0",
  "section 1",
  "section 2",
  "section 3",
];

export const approverStatusEnums = ["pending approval", "approved", "rejected"];

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
  'paid and cancelled',
  'recovered',
];


export const itinerarySchema = {
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
      time: String,
      checkInTime: String,
      checkOutTime: String,
      needBreakFast: Boolean,
      needLunch: Boolean,
      needDinner: Boolean,
      needNonSmokingRoom : Boolean,
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
      returnDate: String,
      selectedDates: [String],
      class: String,
      time: String,
      pickupAddress: String,
      dropAddress: String,
      isFullDayCab: Boolean,

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
      bkd_returnDate: String,
      bkd_isFullDayCab: String,
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
    },
  ],

  carRentals: [
    {
      itineraryId: mongoose.Schema.ObjectId,
      formId: String,
      sequence: Number,
      date: Date,
      returnDate: String,
      selectedDates: [String],
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
          imageUrl: String,
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
  tenantName: {
    type: String,
  },
  companyName: {
    type: String,
  },
  travelRequestId: {
    type: mongoose.Schema.Types.ObjectId, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
    // unique: true,
    // required: true,
  },
  travelRequestNumber: {
    type: String,
    // required: true,
  },
  travelType: {
    type: String,
  },
  tripPurpose: {
    type: String,
    // required: true,
  },
  tripPurposeDescription: {
    type: String,
    // required: true,
  },
  tripName:{
    type: String,
  },
  travelRequestStatus: {
    //initialize with status as 'draft'
    type: String,
    enum: travelRequestStatusEnums,
    default: "draft",
    // required: true,
  },
  travelRequestState: {
    //initialize with state as 'section 0'
    type: String,
    enum: travelRequestStateEnums,
    default: "section 0",
    // required: true,
  },
  createdBy: {
    type: { empId: String, name: String }, //employee Id by whom TR is raised
    // required: true,
  },
  createdFor: {
    type: { empId: String, name: String }, //employee Id for whom TR is raised
    // required: false,
  },
  teamMembers: [],
  travelAllocationHeaders: [
    //level1, level2 Structure
    //{headerName: String, headerValues:[String]}
    //level3 Structure
    //{
    //  categoryName:String,
    //  allocations:[{headerName:String, headerValues:[String]}]
    //}
  ],
  itinerary: itinerarySchema,
  formData: formDataSchema,
  tripType: { oneWayTrip: Boolean, roundTrip: Boolean, multiCityTrip: Boolean },
  travelDocuments: [String],
  bookings: [
    {
      itineraryReference: {},
      docURL: String,
      details: {},
      status: {},
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
      imageUrl: String,
    },
  ],
  assignedTo: {
    empId: { type: String, default: null },
    name: { type: String, default: null }
},
  bookedBy: { 
    empId: { type: String, default: null },
    name: { type: String, default: null }
   },
  recoveredBy: {
    empId: { type: String, default: null },
    name: { type: String, default: null }
    },
  preferences: [String],
  travelViolations: {},
  travelRequestDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  actionedUpon:{
    type:Boolean,
    default:false
  },
  travelBookingDate: Date,
  travelCompletionDate: Date,
  cancellationDate: Date,
  rejectionReason: String,
  isCancelled: Boolean,
  cancellationReason: String,
  isCashAdvanceTaken: Boolean,
  isAddALeg: Boolean,
  sentToTrip: Boolean,
});

travelRequestSchema.pre("save", async function (next) {
  // Generate a new ObjectId and set it for each section if not already there

  const itineraryItemTypes = [
    "flights",
    "cabs",
    "trains",
    "buses",
    "hotels",
    "carRentals",
    "personalVehicles",
  ];

  itineraryItemTypes.forEach((type) => {
    this.itinerary[type].forEach((doc) => {
      if (!doc.itineraryId || !mongoose.isValidObjectId(doc.itineraryId)) {
        console.log("not valid id");
        doc.itineraryId = new mongoose.Types.ObjectId();
      }
    });
  });

  // Continue with the save operation
  next();
});

travelRequestSchema.pre("validate", function (next) {
  if (!travelRequestStatusEnums.includes(this.travelRequestStatus)) {
    // If status is not in the enum, throw a validation error
    next(new Error("Invalid travel request status"));
  } else {
    // Continue with the validation
    next();
  }
});

travelRequestSchema.pre("validate", function (next) {
  if (!travelRequestStateEnums.includes(this.travelRequestState)) {
    // If status is not in the enum, throw a validation error
    next(new Error("Invalid travel request state"));
  } else {
    // Continue with the validation
    next();
  }
});
