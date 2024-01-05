import mongoose from "mongoose"



// login logout schema
const userSchema = new mongoose.Schema({
    tenantId: mongoose.Types.ObjectId,
    tenantName: String,
    fullName: String,
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: String,
    otp: String,
    otpSentTime: Date
})

// model from the schema
const User = mongoose.model('login_logout_container', userSchema)

export default User