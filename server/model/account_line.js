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

const Accountline = mongoose.model('Accountline', accountlineSchema);

// Function to create an accountline document with the tenantId
async function createAccountlineWithTenantId(tenantId, accountLineData) {
    try {
      // Find the HRCompany document by its tenantId
      const hrCollection = await HRCompany.findOne({ tenantId: tenantId });
  
      if (!hrCollection) {
        throw new Error('HRCompany document not found');
      }
  
      // Create a new accountline document with the obtained tenantId
      const accountline = new Accountline({
        tenantId: hrCollection.tenantId, // 
        accountLines: [accountLineData],
      });
  
      // Save the newly created accountline document
      const savedAccountline = await accountline.save();
  
      return savedAccountline;
    } catch (error) {
      console.error('Error creating accountline:', error);
      throw error;
    }
  }
  
// Export the Accountline model and the createAccountlineWithTenantId function
export { Accountline, createAccountlineWithTenantId }
