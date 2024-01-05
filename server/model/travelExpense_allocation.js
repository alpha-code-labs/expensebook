import mongoose from 'mongoose'

const travelExpenseAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  travelExpenseAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})


const TravelExpenseAllocation = mongoose.model("TravelExpenseAllocation", travelExpenseAllocationSchema)

export default TravelExpenseAllocation;
