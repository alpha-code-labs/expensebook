import mongoose from 'mongoose';

// Define constant enums for expenseStatus and expenseHeaderType
const expenseStatusEnums = [
  'draft',
  'pending approval',
  'approved',
  'rejected',
  'pending payment',
  'paid',
  'paid and distributed',
];

const expenseHeaderTypeEnums = ['travel', 'non travel'];

const expenseLineSchema = new mongoose.Schema({
  transactionData: {
    businessPurpose: String,
    vendorName: String,
    billNumber: String,
    grossAmount: Number,
    taxes: Number,
    totalAmount: Number,
    description: String,
  },
  expenseType: String,
  personalExpense: Boolean,
  modeOfPayment: String,
  billImageUrl: String,
});

const expenseHeaderSchema = new mongoose.Schema({
  expenseHeaderID: {
    type: String,
    required: true,
  },
  tripID: String,
  expenseHeaderType: {
    type: String,
    enum: expenseHeaderTypeEnums,
  },
  tripPurpose: {
    type: String,
    required: true,
  },
  createdBy:{
    type: {empId: String, name: String},  //employee Id by whom Expense is raised
    required: true
  },
  createdFor: {
    type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
    required: true
  },
  teamMembers:{
    type: [{empId: String, name: String}], //employee Id's for whom Expense is raised
  },
  expenseStatus: {
    type: String,
    enum: expenseStatusEnums,
  },
  expenseSubmissionDate: Date,
  expenseLines: [expenseLineSchema],
  approvers: [
    {
        empId: String,
        name: String
    }
  ],
  expenseViolations: [String],
  expenseRejectionReason: String,
});

const expenseContainerSchema = new mongoose.Schema({
  tenantID: String,
  expenseHeaders: [expenseHeaderSchema],
});

const ExpenseContainer = mongoose.model('ExpenseContainer', expenseContainerSchema);

export default ExpenseContainer;
