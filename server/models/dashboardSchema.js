import mongoose from "mongoose";
import { tripSchema } from "./tripSchema.js";

const dashboardSchema = new mongoose.Schema({
    tenantId: {
        type:String,
        required:false
    },
    tenantName:{
        type: String,
        required:false
    },
    companyName: {
        type: String,
        required: true,
    },
    embeddedTrip: tripSchema,
})

const dashboard = mongoose.model('dashboard', dashboardSchema);

export default dashboard 