import mongoose from 'mongoose';
import { reimbursementSchema } from "./reimbursementSchema.js";
import { tripSchema } from './tripSchema.js';
  
const reportingSchema = new mongoose.Schema({
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
    createdBy:{
      type: {empId: String, name: String}, 
      required: true
    },
    createdFor: {
      type: {empId: String, name: String}, 
      required: false
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
    reimbursementSchema: {
      type: reimbursementSchema,
      required: false, // Make reimbursementSchema optional
    },
    tripSchema: tripSchema, // trip Schema has travel,cash,travel expenses included.
  }); 


const reporting = mongoose.model('reporting', reportingSchema)
export default reporting













