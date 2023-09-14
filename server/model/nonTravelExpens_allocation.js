import mongoose from 'mongoose'

const nonTravelExpenseAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  nontravelExpenseAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})


const nonTravelExpenseAllocation = mongoose.model("nonTravelExpenseAllocation", nonTravelExpenseAllocationSchema)

export default nonTravelExpenseAllocation;
