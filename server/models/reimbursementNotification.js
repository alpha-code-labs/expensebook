
import mongoose from 'mongoose';

const messageStatusEnums = [
    'information',
    'urgent',
    'action'
]

const approverStatusEnums = ["pending approval", "approved", "rejected"];

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
        // expires: '24h', 
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { _id: false }); 

const expenseNotificationSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
    },
    expenseHeaderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    employee: {
        empId: {
            type: String,
            required: function() {
                return !this.approvers || this.approvers.length === 0;
            },
            trim: true,
        },
        name: {
            type: String,
            required: function() {
                return !this.approvers || this.approvers.length === 0;
            },
            trim: true,
        },
    },
    approvers: [
        {
            empId: String,
            name: String,
            status: {
                type: String,
                enum: approverStatusEnums,
            },
            imageUrl: String,
        },
    ],
    messages: {
        type: [MessageSchema],
        required: true,
        validate: [arrayLimit, '{PATH} exceeds the limit of 100 messages'],
    },
}, { timestamps: true });

function arrayLimit(val) {
    return val.length <= 100; 
}

const EXPENSE_NOTIFICATION = mongoose.model('reimbursementNotification', expenseNotificationSchema);
export default EXPENSE_NOTIFICATION;