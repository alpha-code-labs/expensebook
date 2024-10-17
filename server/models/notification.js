import mongoose from 'mongoose';

const messageStatusEnums = [
    'information',
    'urgent',
    'action'
]

const MessageSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(), 
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: messageStatusEnums,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '24h', 
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { _id: false }); 

const NotificationSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
    },
    travelRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
    },
    employee: {
        empId: {
            type: String,
            required: true,
            trim: true, 
        },
        name: {
            type: String,
            required: true,
            trim: true, 
        },
    },
    messages: {
        type: [MessageSchema],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 100 messages'], 
    },
}, { timestamps: true }); 

function arrayLimit(val) {
    return val.length <= 100; 
}

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;

export{
    messageStatusEnums
}