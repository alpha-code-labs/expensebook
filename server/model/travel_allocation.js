import mongoose from 'mongoose'

const travelAllocationSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  travelAllocationHeaders: [{
    headerName: {
      type: String,
      required: true,
    },
    headerValues: [{
      type: String,
    }],
  }],
})


const TravelAllocation = mongoose.model("TravelAllocation", travelAllocationSchema)

export default TravelAllocation;
