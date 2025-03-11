import mongoose from 'mongoose';

const messageStatusEnums = [
    'information',
    'urgent',
    'action',
    'alert',
    'important',
    'reminder',
    'mandatory'
];


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
    urlData: {
        type: Map,
        of: Object,
        default: {}, 
    },
    status: {
        type: String,
        enum: messageStatusEnums,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { _id: false });

const FinanceNotificationSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
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

const FinanceNotification = mongoose.model('FinanceNotification', FinanceNotificationSchema);
export default FinanceNotification;