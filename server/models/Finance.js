const mongoose=require("mongoose");
//const travelRequestSchema = require('./travelRequest.js').travelRequestSchema;


const cashAdvanceStatusEnum = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'awaiting pending settlement',
  'pending settlement',
  'paid',
  'cancelled',
  'paid and cancelled'
];


const cashAdvanceStateEnums = [
  'section 0',
  'section 1',
  'section 2',
  'section 3',
];


const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];


const financeSchema = new mongoose.Schema({
  travelRequestData:  {
      type: String, //travelRequestSchema,
      required: true,
    },
  cashAdvancesData: [
    {
      tenantId: {
        type: String,
        required: true,
      },
      travelRequestId: {
        type: String,
        required: true,
      },
      travelRequestNumber:{
        type: String,
        required: true,
      },
      cashAdvanceId: {
        type: String,
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
});


module.exports = mongoose.model('Finance', financeSchema);


// export default finance


 



