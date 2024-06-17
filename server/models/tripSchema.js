import mongoose from 'mongoose';

//---------------travel---------

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

const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
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


//---------------------cash---------
  
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
  'cancelled',
  'recovered',
];


//-----------trip---------
const tripStatusEnum = [
  'upcoming',
  'modification',
  'transit',
  'completed',
  'paid and cancelled',
  'cancelled',
  'recovered',
];

//-----travel expense --------------
const expenseHeaderTypeEnums = ['travel'];

// Define constant enums for expenseStatus and expenseHeaderType
const expenseHeaderStatusEnums = [
  'draft',
  'pending approval', 
  'approved',
  'rejected',
  'paid',
  'pending settlement',
  'paid and distributed',
];

const lineItemStatusEnums = [
  'draft',
  'save',
  'submit',
  'delete'
]

//it is dynamic, any expense lines fields can be added
const expenseLineSchema = new mongoose.Schema({
  expenseLineId:mongoose.Schema.Types.ObjectId,
  travelType: String,
  lineItemStatus: {
    type: String,
    enum: lineItemStatusEnums,
  },
  expenseLineAllocation : [{ //Travel expense allocation comes here
    headerName: String,
    headerValues: String,
  }],
  expenseAllocation_accountLine: String,
  alreadySaved: Boolean, // when saving a expense line , make sure this field marked as true
  expenseCategory: {
    // categoryName: String,
    // fields:[],
    // travelClass: String,
  }, //expense category comes here, ex- flights, cabs for travel ,etc
  modeOfPayment: String,
  isMultiCurrency: {
    type: Boolean,
    default: false,
  },// if currency is part of multiCurrency Table
  multiCurrencyDetails: {
    type: {
      nonDefaultCurrencyType: String,
      originalAmountInNonDefaultCurrency: Number,
      conversionRateToDefault: Number,
      convertedAmountToDefaultCurrency: Number,
    },
    // required: function() {
    //   return this.isMultiCurrency === true;
    // },
  },
  isPersonalExpense:{
    type:Boolean,
    default: false
  }, //if bill has personal expense, can be partially or entire bill.
  personalExpenseAmount: {
    type: Number,
    // This field is required if 'isPersonalExpense' is true
    required: function() {
      return this.isPersonalExpense === true;
    },
  },
  billImageUrl: String,
  billRejectionReason: String,
},{ strict: false });

// travelExpense microservice and trip microservice schema's are identical
 const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName: {
    type: String,
    // required: true,
  },
  companyName: {
    type: String,
    // required: true,
  },
  tripId:{
    type: mongoose.Types.ObjectId, 
    // unique: true,
    // required: true,
  },
  tripNumber:{
    type: String,
    // required: true,
  },
  createdBy:{
    type: {empId: String, name: String},
    required: true
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
  expenseAmountStatus: {
    totalCashAmount: {
      type: Number,
      default: 0,
    },
    totalAlreadyBookedExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalPersonalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalRemainingCash: {
      type: Number,
      default: 0,
    },
  },
    isSentToExpense:{
      type: Boolean,
      default: false,
    }, 
    notificationSentToDashboardFlag:{
      type: Boolean,
      default:null,
    },
    travelRequestData: {
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
      type: mongoose.Types.ObjectId, 
      // unique: true,
      },
      travelRequestNumber:{
        type: String,
      },
      tripPurpose: {
      type: String,
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
      type: {empId: String, name: String}, //employee Id by whom TR is raised
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
      assignedTo:{empId: String, name: String},
      bookedBy:{empId: String, name: String},
      recoveredBy:{empId: String, name: String},
      preferences: [String],
      travelViolations: {},
      travelRequestDate: {
      type: String,
      required:true
      },
      travelBookingDate: Date,
      travelCompletionDate: Date,
      cancellationDate:Date,
      travelRequestRejectionReason: String,
      isCancelled:Boolean,
      cancellationReason:String,
      isAddALeg:Boolean,
      isCashAdvanceTaken: Boolean,
      sentToTrip:Boolean,
      travelType: String,
      },
    cashAdvancesData: [
        {
          tenantId: {
            type: String,
            required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            required: true,
          },
          travelRequestNumber:{
            type: String,
            required: true,
          },
          cashAdvanceId: {
            type: mongoose.Types.ObjectId, 
            required: true,
          },
          cashAdvanceNumber:{
            type: String,
            required: true,
          },
          createdBy: {
              empId: String,
              name: String,
          },
          cashAdvanceStatus: {
            type: String,
            enum: cashAdvanceStatusEnum,
            required: true,
            default: 'draft',
          },
          cashAdvanceState: {
            type: String,
            enum: cashAdvanceStateEnums,
            default: 'section 0',
            required: true,
          },
          amountDetails: [
            {
              amount: Number,
              currency: {},
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
          assignedTo:{empId:String, name:String},
          paidBy:{empId:String, name:String},
          recoveredBy:{empId:String, name:String},
          cashAdvanceRequestDate: Date,
          cashAdvanceApprovalDate: Date,
          cashAdvanceSettlementDate: Date,
          cashAdvanceViolations: String,
          cashAdvanceRejectionReason: String,
        },
      ],
    travelExpenseData:[
        {
          tenantId: {
            type: String,
            required: true,
          },
          tenantName: {
            type: String,
            // required: true,
          },
          companyName: {
            type: String,
            // required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          travelRequestNumber:{
            type: String,
            // required: true,
          },
          expenseHeaderNumber:{
            type: String,
          },
          expenseHeaderId: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          expenseHeaderType: { 
            type: String,
            enum: expenseHeaderTypeEnums,
          },
          createdBy:{
            type: {empId: String, name: String}, //employee Id by whom TR is raised
            // required: true
            },
          travelAllocationFlags:{ //Comes from HRMaster -Based on this expense booking screen changes
            level1:Boolean,
            level2:Boolean,
            level3:Boolean,
          },
          expenseHeaderStatus: { 
            type: String,
            enum: expenseHeaderStatusEnums,
            default: "new",
          },
          alreadyBookedExpenseLines: {
            type: itinerarySchema,
            default: undefined,
          },
          expenseLines: [expenseLineSchema],
          approvers: [ // added directly from travel request approvers
            {
              empId: String,
              name: String,
              status: {
                type: String,
                enum: approverStatusEnums,
              },
            }
          ],
          expenseSettlement:{
            type:String,
          },
          defaultCurrency:{
            type: Object,
          },
          allocations:[],
          violations: [String],
          travelType: String,
          rejectionReason: String,
          paidBy:{empId:String, name:String},
          recoveredBy:{empId:String, name:String},
          submissionDate: Date,
        }
      ],
}); 

  
// Function to generate the incremental number
const generateIncrementalNumber = (tenantName, incrementalValue) => {
  if (typeof tenantName !== 'string' || tenantName === null || tenantName === undefined) {
    throw new Error('Invalid tenantName parameter');
  }
  
  if (typeof incrementalValue !== 'number' || isNaN(incrementalValue)) {
    throw new Error('Invalid incrementalValue parameter');
  }
  
  try {
    const formattedTenant = (tenantName || '').toUpperCase().substring(0, 3);
    return `TRIP-${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
  } catch (error) {
    console.error('Error generating incremental number:', error);
    throw error;
  }
};

// Pre-save hook to generate and assign tripNumber if it doesn't exist
tripSchema.pre('validate', async function (next) {
  if (!this.tripNumber) {
    // Query to find the maximum incremental value
    const maxIncrementalValue = await this.constructor.findOne({}, 'tripNumber')
      .sort('-tripNumber')
      .limit(1);

    // Calculate the next incremental value
    const nextIncrementalValue = (maxIncrementalValue && maxIncrementalValue.tripNumber)
      ? parseInt(maxIncrementalValue.tripNumber.substring(9), 10) + 1
      : 1;

    // Generate the new tripNumber
    this.tripNumber = generateIncrementalNumber(this.tenantName, nextIncrementalValue);

    // Logging the latest generated tripNumber
    console.log(`Latest generated tripNumber: ${this.tripNumber}`);
  }
  next();
});
  
const Trip = mongoose.model('tripsMonday', tripSchema);

export default Trip;



