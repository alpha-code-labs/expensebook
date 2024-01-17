const mongoose = require("mongoose");
//const travelRequestSchema = require('./travelRequest.js').travelRequestSchema;

const cashAdvanceStatusEnum = [
  "draft",
  "pending approval",
  "approved",
  "rejected",
  "awaiting pending settlement",
  "pending settlement",
  "paid",
  "cancelled",
  "paid and cancelled",
];

const cashAdvanceStateEnums = [
  "section 0",
  "section 1",
  "section 2",
  "section 3",
];

const approverStatusEnums = ["pending approval", "approved", "rejected"];

const financeSchema = new mongoose.Schema({
  settlementFlag: { type: Boolean },
  travelRequestData: {
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
      travelRequestNumber: {
        type: String,
        required: true,
      },
      cashAdvanceId: {
        type: String,
        unique: true,
        required: true,
      },
      cashAdvanceNumber: {
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
        default: "draft",
      },
      cashAdvanceState: {
        type: String,
        enum: cashAdvanceStateEnums,
        default: "section 0",
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
      assignedTo: { empId: String, name: String },
      paidBy: { empId: String, name: String },
      recoveredBy: { empId: String, name: String },
      cashAdvanceRequestDate: Date,
      cashAdvanceApprovalDate: Date,
      cashAdvanceSettlementDate: Date,
      cashAdvanceViolations: String,
      cashAdvanceRejectionReason: String,
      tripId: "String",
      expenseHeaderId: "String",

      expenseHeaderStatus: "String",
      tenantId: "String",
      tenantName: "String",
      companyName: "String",
      travelRequestId: "String",
      expenseHeaderNumber: "String",
      expenseHeaderType: "String",

      createdBy: {
        type: Object,
      },

      createdFor: { type: Object },

      teamMembers: { type: Array },

      alreadyBookedExpenseLines: { type: Array },

      expenseLines: { type: Array },

      approvers: { type: Array },

      expenseViolations: { type: Array },
      expenseRejectionReason: "String",
      expenseSubmissionDate: Date,
    },
  ],
});

module.exports = mongoose.model("Finance", financeSchema);

// export default finance
