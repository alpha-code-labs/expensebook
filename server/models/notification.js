import mongoose from 'mongoose';

const messageStatusEnums = [
    'information',
    'urgent',
    'action',
    'alert',
    'important',
    'reminder',
    'mandatory'
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
    urlData: {
        type: Map,
        of: Object,
        default: {}, 
    },
    status:{
        type: String,
        enum: messageStatusEnums,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: '1024h', 
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

// Custom validation to ensure only one of employee or approvers is present
NotificationSchema.pre('validate', function(next) {
    if ((this.employee && (this.employee.empId || this.employee.name)) && this.approvers && this.approvers.length > 0) {
        return next(new Error('Either employee or approvers should be present, but not both.'));
    }
    if (!this.employee && (!this.approvers || this.approvers.length === 0)) {
        return next(new Error('Either employee or approvers must be present.'));
    }
    next();
});


function arrayLimit(val) {
    return val.length <= 100; 
}

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;

export{
    messageStatusEnums
}


