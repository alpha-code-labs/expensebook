import mongoose from "mongoose";
import jwt from "jsonwebtoken";


const Schema = mongoose.Schema;
const JWT_SECRET = process.env.JWT_SECRET
const employeeSchema = new Schema({
  employeeDetails: {
    empId: String,
    name: String,
  },
  email: {
    type:String,
    required:true,
    unique:true
},
superAdmin:Boolean,
employeeRoles:Object,
password: String,
temporaryPasswordFlag:Boolean,
verified:Boolean,
otp: String,
otpSentTime: Date
});


employeeSchema.methods.generateAuthToken = function () {
  const tokenPayload = {
    tenantId: this.tenantId, // Assuming tenantId is a property of the user
    empId: this.employeeDetails.empId,
  };
  const token = jwt.sign(tokenPayload, JWT_SECRET || '1234', { expiresIn: '1h' });
  return token;
};

const tenantSchema = new Schema({
  tenantId: String,
  companyName: String,
  companyHQ:String,
  employees: [employeeSchema],
  onboardingFlag:Boolean
});

const TenanatModel = mongoose.model('Tenant', tenantSchema);

export default TenanatModel;


  