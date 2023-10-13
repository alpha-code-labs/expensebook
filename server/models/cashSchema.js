import mongoose from 'mongoose';

const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
];

const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
];



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
  cashAdvanceId: {
    type : String,
    unique:true,
    required:true
  },
  createdBy:{
    type: String,  //employee Id by whom CA is raised 
    required: true
  },
  cashAdvanceStatus: {
    type: String,
    enum: cashAdvanceStatusEnum,
    required: true,
    default: 'draft'
    
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
   embeddedTravelRequest: {
    type: Object
  },
});


const CashAdvance = mongoose.model('CashAdvance', cashAdvanceSchema);

export default CashAdvance

 