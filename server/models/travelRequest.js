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

const itinerarySchema = ([{
  journey:{from:String, to:String, departure:{date:String, time:String, isModified:Boolean, isCancelled:Boolean, cancellationDate:String, cancellationReason:String}, return:{date:String, time:String, isModified:Boolean, isCancelled:Boolean, cancellationDate:String, cancellationReason:String}},
  hotels:[{class:String, checkIn:String, checkOut:String, hotelClassViolationMessage:String, isCancelled:Boolean, cancellationDate:String}],
  cabs:[{date:String, class:String, prefferedTime:String, pickupAddress:String, dropAddress:String, cabClassVioilationMessage:String, isModified:Boolean, isCancelled:Boolean, cancellationDate:String, cancellationReason:String}],
  modeOfTransit:String,
  travelClass:String,
  needsVisa:Boolean,
  needsBoardingTransfer:Boolean,
  needsHotelTransfer:Boolean,
  boardingTransfer:{
    prefferedTime:String,
    pickupAddress:String,
    dropAddress:String,
    isModified:Boolean,
    isCancelled:Boolean, 
    cancellationDate:String, 
    cancellationReason:String 
  },
  hotelTransfer:{
    prefferedTime:String,
    pickupAddress:String,
    dropAddress:String, 
    isModified:Boolean,
    isCancelled:Boolean, 
    cancellationDate:String, 
    cancellationReason:String
  },
  needsHotel:Boolean,
  needsCab:Boolean,
}])

const travelRequestSchema = new mongoose.Schema({
    tenantId: {
    type: String,
    required: true,
  },
  travelRequestId: {
    type: String, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
    required: true,
    unique: true,
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
})

const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)
export default TravelRequest