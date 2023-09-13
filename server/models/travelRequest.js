import mongoose from 'mongoose'

const travelRequestStatusEnums = [
    'draft', 
    'pending approval', 
    'approved', 'rejected', 
    'pending booking', 
    'booked', 
    'canceled',  
] 

const travelRequestStateEnums = [
    'section 0', 
    'section 1', 
    'section 2', 
    'section 3', 
    'section 4', 
    'section 5'
]

//not yet fixed
const travelAndNonTravelPoliciesSchema = new mongoose.Schema({
    travelPolicy: {
        InternationalPolicy: {},
        domesticPolicy: {},
        localPolicy: {}
    },
    nonTravelPolicy: {}
})


//not yet fixed
const itinerarySchema = ({
    departureCity: String,
    arrivalCity: String,
    departureDate: String,
    returnDate: String,
    hotels: [String],
    cabs: [String],
    flights: [String],      
})

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
    type: String,  //employee Id by whom TR is raised 
    required: true
  },
  createdFor: {
    type: [String], //employee Id's for whom TR is raised
    required: true
  },
  travelAllocationHeaders: [
    {
      headerName: String,
      values: [
        {
          valueName: String,
          percentage: Number,
        },
      ],
    },
  ],
  itinerary: itinerarySchema,
  travelDocuments: [String],
  bookings: [
    {
      vendorName: String,
      billNumber: String,
      billDescription: String,
      grossAmount: Number,
      taxes: Number,
      date: String,
      imageUrl: String,
    },
  ],
  approvers: [String],
  preferences: [String],
  travelViolations: [String],
  travelRequestDate: {
    type: String,
    required:true
  },
  travelBookingDate: String,
  travelCompletionDate: String,
  travelRequestRejectionReason: String,
  travelAndNonTravelPolicies: travelAndNonTravelPoliciesSchema,
})


const TravelRequest = mongoose.model('travel_request_container', travelRequestSchema)
module.exports = TravelRequest