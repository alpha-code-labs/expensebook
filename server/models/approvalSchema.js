import mongoose from 'mongoose';
import {tripSchema} from './tripSchema.js';
import { reimbursementSchema } from './reimbursementSchema.js';
import { travelRequestSchema } from './travelSchema.js';


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
'cancelled'
];


// Define constant enums for status values
const approvalTypesEnums = ['travel', 'travel-expense', 'non-travel-expense'];


//approval schema
const approvalSchema = new mongoose.Schema({
    tenantId: {
      type: String,
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
    travelRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: function() {
        return !this.reimbursementSchema; // Ensure uniqueness only if reimbursementSchema is not present
      },
      required: function() {
        return !this.reimbursementSchema; // Make required only if reimbursementSchema is not present
      },
    },
    approvalNumber:{
      type: String,
    },
    approvalType: { // to be added when getting data from other microservices
        type: String,
        enum: approvalTypesEnums,
        // required: true,
    },
      travelRequestData:  {
        type: travelRequestSchema,
        required: function() {
          return !this.reimbursementSchema;
        },
      },
      cashAdvancesData: [
        {
          tenantId: {
            type: String,
            // required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          travelRequestNumber:{
            type: String,
            // required: true,
          },
          cashAdvanceId: {
            type: mongoose.Types.ObjectId, 
            // required: true,
          },
          cashAdvanceNumber:{
            type: String,
            // required: true,
          },
          createdBy: {
              empId: String,
              name: String,
          },
          cashAdvanceStatus: {
            type: String,
            enum: cashAdvanceStatusEnum,
            // required: true,
            default: 'draft',
          },
          cashAdvanceState: {
            type: String,
            enum: cashAdvanceStateEnums,
            default: 'section 0',
            // required: true,
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
    tripSchema: tripSchema, // used when expense sends expense for approval entire tripData is updated
    reimbursementSchema:{
      type:reimbursementSchema,
      required:false,
    },
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








