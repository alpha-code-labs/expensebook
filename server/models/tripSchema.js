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
];
  
const approverStatusEnums = [
    'pending approval',
    'approved',
    'rejected',
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

const expenseLineSchema = new mongoose.Schema({
  expenseLineId:mongoose.Schema.Types.ObjectId,
  transactionData: {
    businessPurpose: String,
    vendorName: String,
    billNumber: String,
    billDate: String,
    taxes: Number,
    totalAmount: Number,
    description: String,
  },
  lineItemStatus: {
    type: String,
    enum: lineItemStatusEnums,
  },
  expenseLineAllocation : [{ //Travel expense allocation comes here
    headerName: {
      type: String,
    },
    headerValues: [{
      type: String,
    }],
  }],
  alreadySaved: Boolean, // when saving a expense line , make sure this field marked as true
  expenseLineCategory: [{
    categoryName: String,
  }], //expense category comes here, ex- flights, cabs for travel ,etc
  modeOfPayment: String,
  isInMultiCurrency: Boolean, // if currency is part of multiCurrency Table
  multiCurrencyDetails: {
    type: [{
      nonDefaultCurrencyType: String,
      originalAmountInNonDefaultCurrency: Number,
      conversionRateToDefault: Number,
      convertedAmountToDefaultCurrency: Number,
    }],
    required: function() {
      return this.isInMultiCurrency === true;
    },
  },
  isPersonalExpense: Boolean, //if bill has personal expense, can be partially or entire bill.
  personalExpenseAmount: {
    type: Number,
    // This field is required if 'isPersonalExpense' is true
    required: function() {
      return this.isPersonalExpense === true;
    },
  },
  billImageUrl: String,
  billRejectionReason: String,
});

// trip microservice and travel expense microservice have same schema
 export const tripSchema = new mongoose.Schema({
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
    tripId:{
      type: mongoose.Types.ObjectId, 
      // unique: true,
      // required: true,
    },
    tripNumber:{
      type: String,
      // required: true,
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
      totalremainingCash: {
        type: Number,
        default: 0,
      },
    },
    isSentToExpense: Boolean,  
    notificationSentToDashboardFlag: Boolean,
      travelRequestData: 
    {
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
      travelBookingDate: Date,
      travelCompletionDate: Date,
      travelRequestRejectionReason: String,
      cancellationDate:Date,
      cancellationReason:String,
      rejectionReason: String,
      rejectionDate: Date,
      isCashAdvanceTaken: Boolean,
      isCancelled:Boolean,
      isAddALeg:Boolean,
      sentToTrip:Boolean,
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
            unique: true,
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
            required: true,
          },
          companyName: {
            type: String,
            required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          travelRequestNumber:{
            type: String,
            // required: true,
          },
          expenseHeaderId: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          expenseHeaderType: { 
            type: String,
            enum: expenseHeaderTypeEnums,
          },
          expenseHeaderStatus: { 
            type: String,
            enum: expenseHeaderStatusEnums,
          },
          alreadyBookedExpenseLines: {
            type: [itinerarySchema],
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
          expenseViolations: [String],
          expenseRejectionReason: String,
          expenseSubmissionDate: Date,
        }
      ],
  }); 
  
const Trip = mongoose.model('trips', tripSchema);

export default Trip;