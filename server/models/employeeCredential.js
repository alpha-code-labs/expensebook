import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeDetails: {
    empId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
});

// Create a model using the schema
const EmployeeCredential = mongoose.model('EmployeeCredential', employeeSchema);

// Export the model
export default EmployeeCredential
