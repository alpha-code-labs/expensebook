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
    type: String, // tenantId_createdBy_tr_#(tr number) | tentative | not fixed
    required: true,
  },
  travelRequestStatus: {
    type: String,
    enum: travelRequestStatusEnums,
    default: 'draft', // Initialize with status as 'draft'
    required: true,
  },
  travelRequestState: {
    type: String,
    enum: travelRequestStateEnums,
    default: 'section 0', // Initialize with state as 'section 0'
    required: true,
  },
  createdBy: {
    type: String, // Employee Id by whom TR is raised
    required: true,
  },
  createdFor: {
    type: [String], // Employee Id's for whom TR is raised
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
  itinerary: itinerarySchema, // Use the itinerarySchema as a sub-schema
  travelDocuments: [String],
  bookings: [
    {
      vendorName: String,
      billNumber: String,
      billDescription: String,
      grossAmount: Number,
      taxes: Number,
      date: Date, // Use Date data type for dates
      imageUrl: String,
    },
  ],
  approvers: [String],
  preferences: [String],
  travelViolations: [String],
  travelRequestDate: {
    type: Date, // Use Date data type for dates
    required: true,
  },
  travelBookingDate: Date, // Use Date data type for dates
  travelCompletionDate: Date, // Use Date data type for dates
  travelRequestRejectionReason: String,
  travelAndNonTravelPolicies: policySchema, // Use the policySchema as a sub-schema
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelRequest',
  },
  cashAdvanceId: String,
  cashAdvanceStatus: {
    type: String,
    enum: cashAdvanceStatusEnum, // Use the constant for enum values
    required: true, // Add validation for required field
  },
  amountDetails: [
    {
      amount: Number,
      currency: String,
      mode: String,
    },
  ],
  approvers: [String],
  cashAdvanceRequestDate: Date, // Use the Date data type for dates
  cashAdvanceApprovalDate: Date, // Use the Date data type for dates
  cashAdvanceSettlementDate: Date, // Use the Date data type for dates
  cashAdvanceViolations: [String],
  cashAdvanceRejectionReason: String,
  additionalCashAdvanceField: String,
});

// Create the Cash Advance model
const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

// Define the Trip schema with references to Travel Request and Cash Advance
const tripSchema = new mongoose.Schema({
  travelRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelRequest',
  },
  cashAdvance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CashAdvance',
  },
  additionalTripField: String,
});

// Create the Trip model
const Trip = mongoose.model('Trip', tripSchema);

export { TravelRequest, CashAdvance, Trip };
