import mongoose from "mongoose"

// Import the HRCompany model
import HRCompany from "./hr_company_structure.js"

//  accountline schema
const accountlineSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  accountLines: [{
    // Define the structure of each accountLine item here
    //  fields like name, balance, etc.
    name: String,
    balance: Number,
    // Other fields for accountLine
  }],
})

export { accountlineSchema as Accountline }