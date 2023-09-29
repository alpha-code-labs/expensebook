import mongoose from 'mongoose';

// Define enums for approvalType, cashAdvanceStatus, travelRequestStatus, and expenseStatus
const ApprovalType = ['travel', 'travel and cash advance', 'cash Advance', 'expense'];
const CashAdvanceStatus = ['draft', 'pending approval', 'approved', 'rejected', 'null'];
const TravelRequestStatus = ['draft', 'pending approval', 'approved', 'rejected'];
const ExpenseStatus = ['draft', 'pending approval', 'approved', 'rejected'];

// Define the Approval schema
const approvalSchema = new mongoose.Schema({
  tenantID: String,
  approvals: [
    {
      approvalID: String,
      approvalType: {
        type: String,
        enum: ApprovalType,
      },
      approvalDetails: {
        cashAdvance: {
          cashAdvanceId: String,
          cashAdvanceStatus: {
            type: String,
            enum: CashAdvanceStatus,
          },
          cashAdvanceRejectionReason: String,
        },
        travelRequest: {
          travelRequestID: String,
          travelRequestStatus: {
            type: String,
            enum: TravelRequestStatus,
          },
          travelRequestRejectionReason: String,
        },
        expense: {
          expenseID: String,
          expenseStatus: {
            type: String,
            enum: ExpenseStatus,
          },
          expenseRejectionReason: String,
        },
      },
    },
  ],
}, { strict: false }); // Allow schema-less properties

// Create and export the Approval model
const Approval = mongoose.model('Approval', approvalSchema);
export default Approval;
