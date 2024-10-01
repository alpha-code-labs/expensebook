import mongoose from 'mongoose';
import { travelRequestSchema } from './travelSchema.js';
import { travelExpenseSchema } from './travelExpenseSchema.js';

//---------------travel---------

const approverStatusEnums = [
  'pending approval',
  'approved',
  'rejected',
];


//---------------------cash---------

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
  'cancelled',
  'recovered',
];


//-----------trip---------
const tripStatusEnum = [
  'upcoming',
  'modification',
  'transit',
  'completed',
  'paid and cancelled',
  'cancelled',
  'recovered',
];

// travelExpense microservice and trip microservice schema's are identical
const tripSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  tenantName: {
    type: String,
    // required: true,
  },
  companyName: {
    type: String,
    // required: true,
  },
  tripId:{
    type: mongoose.Types.ObjectId, 
    // unique: true,
    // required: true,
  },
  tripNumber:{
    type: String,
    // required: true,
  },
  createdBy:{
    type: {empId: String, name: String},
    required: true
    },
  tripStatus: {
    type: String,
    enum: tripStatusEnum,
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
  expenseAmountStatus: {
    totalCashAmount: {
      type: Number,
      default: 0,
    },
    totalAlreadyBookedExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalPersonalExpenseAmount: {
      type: Number,
      default: 0,
    },
    totalRemainingCash: {
      type: Number,
      default: 0,
    },
  },
  travelRequestData:  {
      type: travelRequestSchema,
      required: true,
  },
  cashAdvancesData: [
        {
          tenantId: {
            type: String,
            required: true,
          },
          travelRequestId: {
            type: mongoose.Types.ObjectId, 
            required: true,
          },
          travelRequestNumber:{
            type: String,
            required: true,
          },
          cashAdvanceId: {
            type: mongoose.Types.ObjectId, 
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
  travelExpenseData:[
        {
          type:travelExpenseSchema,
          required:true
        }
  ],
  isSentToExpense:{
        type: Boolean,
        default: false,
  }, 
  notificationSentToDashboardFlag:{
        type: Boolean,
        default:null,
  },
  isCompleted:Boolean,
  isClosed:Boolean
}); 


// Function to generate the incremental number
const generateIncrementalNumber = (tenantName, incrementalValue) => {
  if (typeof tenantName !== 'string' || tenantName === null || tenantName === undefined) {
    throw new Error('Invalid tenantName parameter');
  }
  
  if (typeof incrementalValue !== 'number' || isNaN(incrementalValue)) {
    throw new Error('Invalid incrementalValue parameter');
  }
  
  try {
    const formattedTenant = (tenantName || '').toUpperCase().substring(0, 3);
    return `TRIP-${formattedTenant}${incrementalValue.toString().padStart(6, '0')}`;
  } catch (error) {
    console.error('Error generating incremental number:', error);
    throw error;
  }
};

// Pre-save hook to generate and assign tripNumber if it doesn't exist
tripSchema.pre('validate', async function (next) {
  if (!this.tripNumber) {
    // Query to find the maximum incremental value
    const maxIncrementalValue = await this.constructor.findOne({}, 'tripNumber')
      .sort('-tripNumber')
      .limit(1);

    // Calculate the next incremental value
    const nextIncrementalValue = (maxIncrementalValue && maxIncrementalValue.tripNumber)
      ? parseInt(maxIncrementalValue.tripNumber.substring(9), 10) + 1
      : 1;

    // Generate the new tripNumber
    this.tripNumber = generateIncrementalNumber(this.tenantName, nextIncrementalValue);

    // Logging the latest generated tripNumber
    console.log(`Latest generated tripNumber: ${this.tripNumber}`);
  }
  next();
});

const Trip = mongoose.model('trips', tripSchema);

export default Trip;



