import mongoose from 'mongoose';
import { expenseSchema } from './expenseSchema.js';

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

const tripStatusEnum = [
    'upcoming',
    'modification',
    'transit',
    'completed',
    'paid and cancelled',
    'cancelled',
    'recovered',
  ];
  
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
      travelRequestData: 
    {
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
      isCashAdvanceTaken: Boolean,
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
      travelExpenseData:expenseSchema,
  }); 
  
const Trip = mongoose.model('trips', tripSchema);

export default Trip;