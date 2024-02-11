import mongoose from 'mongoose';
import {tripSchema} from './tripSchema.js';

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
'null'
] 

const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
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


// Define constant enums for status values
const approvalTypesEnums = ['travel', 'travel-expense', 'non-travel-expense'];

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
    itineraryId:{ 
      type: mongoose.Schema.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    formId:{
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
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
    rejectionReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    approvers: [{
      empId: String,
      name: String,
      status: {
      type: String,
      enum: approverStatusEnums,
      },
      },],
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  }],
  
  buses:[{
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    formId:{
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
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
    rejectionReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    approvers: [{
      empId: String,
      name: String,
      status: {
      type: String,
      enum: approverStatusEnums,
      },
      },],
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  }],
  
  trains:[{
    itineraryId:{
      type: mongoose.Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    formId:{
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
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
    rejectionReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    approvers: [{
      empId: String,
      name: String,
      status: {
      type: String,
      enum: approverStatusEnums,
      },
      },],
    bookingDetails:{
      docURL: String,
      docType: String,
      billDetails: {}, 
    }
  }],
  
  
  hotels:[{
    itineraryId: { 
      type: mongoose.Schema.Types.ObjectId, 
      default: new mongoose.Types.ObjectId() },
    formId:{
      type: String,
      default :() => new mongoose.Types.ObjectId().toString(),
    },
    location:String,
    locationPreference:String,
    class:String,
    checkIn:String,
    checkOut:String,
    checkInTime:String,
    checkOutTime:String,
    violations:{
    class: String,
    amount: String,
    },
    bkd_location:String,
    bkd_locationPreference:String,
    bkd_class:String,
    bkd_checkIn:String,
    bkd_checkOut:String,
    bkd_checkInTime:String,
    bkd_checkOutTime:String,
    bkd_violations:{
    class: String,
    amount: String,
    },
    modified:Boolean,
    cancellationDate:String,
    cancellationReason:String,
    rejectionReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    approvers: [{
      empId: String,
      name: String,
      status: {
      type: String,
      enum: approverStatusEnums,
      },
      },],
    bookingDetails:{
    docURL: String,
    docType: String,
    billDetails:{
      vendorName: String,
      totalAmount: String,
      taxAmount: String
      }
    }
  }],
  
  cabs:[{
    itineraryId:{ 
      type :mongoose.Schema.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
    formId:{
      type:String,
      default: new mongoose.Types.ObjectId().toString(),
    },
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
    rejectionReason: String,
    status:{type:String, enum:itineraryStatusEnums},
    approvers: [{
      empId: String,
      name: String,
      status: {
      type: String,
      enum: approverStatusEnums,
      },
      },],
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
  

//approval schema
const approvalSchema = new mongoose.Schema({
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
    approvalId:{
      type: mongoose.Schema.Types.ObjectId,
    },
    travelRequestId:{
      type: mongoose.Schema.Types.ObjectId,
      // required:true
    },
    approvalNumber:{
      type: String,
    },
    approvalType: { // to be added when getting data from other microservices
        type: String,
        enum: approvalTypesEnums,
        // required: true,
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
      required: true,
      },
      travelRequestState: { //initialize with state as 'section 0'
      type: String,
      enum: travelRequestStateEnums,
      // required: true,
      },
      createdBy:{
      type: {empId: String, name: String}, //employee Id by whom TR is raised
      // required: true
      },
      createdFor: {
      type: {empId: String, name: String}, //employee Id for whom TR is raised
      // required: false
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
      type: Date,
      required:true
      },
      travelType: String,
      travelBookingDate: Date,
      travelCompletionDate: Date,
      cancellationDate:Date,
      travelRequestDate: Date,
      rejectionReason: String,
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
          rejectionReason: String,
        },
      ],    
    tripData: tripSchema, // used when expense sends expense for approval entire tripData is updated
    notificationSentToDashboardFlag: Boolean,
  });
  
// Pre hook to generate and assign an ObjectId to approvalId before saving the document
approvalSchema.pre('save', function(next) {// Include 'next' as a parameter
  if(!this.approvalId) {
    this.approvalId = new mongoose.Types.ObjectId(); 
  }
  next(); // Call 'next' to proceed with the save operation
})

// Function to generate the incremental number
const generateIncrementalNumber = (tenantName, incrementalValue) => {
  const formattedTenant = (tenantName || '').toUpperCase().substring(0, 3);
  return `AP${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
};

// Pre-save hook to generate and assign approvalNumber if it doesn't exist
approvalSchema.pre('save ', async function (next) {
  try {
    if (!this.approvalNumber) {
      // Find the highest incremental value
      const maxIncrementalValueDoc = await this.constructor.findOne({}, 'approvalNumber')
        .sort('-approvalNumber')
        .limit(1);

      // Calculate the next incremental value
      const nextIncrementalValue = (maxIncrementalValueDoc ? parseInt(maxIncrementalValueDoc.approvalNumber.substring(9), 10) : 0) + 1;

      // Generate the new approvalNumber
      this.approvalNumber = generateIncrementalNumber(this.tenantName, nextIncrementalValue);

      // Logging the latest generated approvalNumber
      console.log(`Latest generated approvalNumber: ${this.approvalNumber}`);
    }
    next();
  } catch (error) {
    // Handle errors and call next with the error
    console.error('Error generating approvalNumber:', error);
    next(error);
  }
});
  
export const Approval = mongoose.model('Approval', approvalSchema);
  








