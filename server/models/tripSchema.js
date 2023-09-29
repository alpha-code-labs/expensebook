import mongoose from 'mongoose';

// Define constants for enum values
const travelRequestStatusEnums = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'pending booking',
  'booked',
  'canceled',
];

const travelRequestStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
  'section 4',
  'section 5',
];

const policySchema = new mongoose.Schema({
  travelPolicy: {
    InternationalPolicy: {},
    domesticPolicy: {},
    localPolicy: {},
  },
  nonTravelPolicy: {},
});

const itinerarySchema = new mongoose.Schema({
  departureCity: String,
  arrivalCity: String,
  departureDate: Date,
  returnDate: Date,
  hotels: [String],
  cabs: [String],
  flights: [String],
});

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
];

const tripStatusEnum = [
  'upcoming',
  'modification',
  'transit',
  'completed',
  'cancelled',
];

const travelRequestSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName: {
    type: String,
    required: true,
  },
  travelRequestId: {
    type: process.env.NODE_ENV === 'production' ? mongoose.Schema.Types.ObjectId : String,
    required: true,
  },
  travelRequestStatus: {
    type: String,
    enum: travelRequestStatusEnums,
    default: 'draft',
    required: true,
  },
  travelRequestState: {
    type: String,
    enum: travelRequestStateEnums,
    default: 'section 0',
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  travelName:{
    type: String,
  },
  createdFor: {
    type: [String],
    required: true,
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
      date: Date,
      imageUrl: String,
    },
  ],
  approvers: [String],
  preferences: [String],
  travelViolations: [String],
  travelRequestDate: {
    type: Date,
    required: true,
  },
  travelBookingDate: Date,
  travelCompletionDate: Date,
  travelRequestRejectionReason: String,
  travelAndNonTravelPolicies: policySchema,
});

// Create the Travel Request model
const TravelRequest = mongoose.model('TravelRequest', travelRequestSchema);

// Define the Cash Advance schema with a reference to Travel Request
const cashAdvanceSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  travelRequestId: {
    type: process.env.NODE_ENV === 'production' ? mongoose.Schema.Types.ObjectId : String,
    ref: 'TravelRequest',
  },
  cashAdvanceId: String,
  cashAdvanceStatus: {
    type: String,
    enum: cashAdvanceStatusEnum,
    required: true,
  },
  amountDetails: [
    {
      amount: Number,
      currency: String,
      mode: String,
    },
  ],
  approvers: [String],
  cashAdvanceRequestDate: Date,
  cashAdvanceApprovalDate: Date,
  cashAdvanceSettlementDate: Date,
  cashAdvanceViolations: [String],
  cashAdvanceRejectionReason: String,
  additionalCashAdvanceField: String,
});

// Create the Cash Advance model
const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  tripName:{
    type: String,
  },
  tripStatus: {
    type: String,
    enum: tripStatusEnum,
    default: 'upcoming',
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
  notificationSentToDashboardFlag: Boolean,

  // Embedded documents for quick access
  embeddedTravelRequest: {
    type: Object, // Use Object type for embedding entire document
  },
  embeddedCashAdvance: {
    type: Object, // Use Object type for embedding entire document
  },
});

// Create the Trip model
const Trip = mongoose.model('Trip', tripSchema);

export { TravelRequest, CashAdvance, Trip };
 