import Notification from "../models/notification.js";


const fetchEmployeeNotifications = async (tenantId, empId) => {
    try {
        const notifications = await Notification.find({ tenantId, 'employee.empId': empId });

        if (!notifications || notifications.length === 0) {
            return []; 
        }

        return notifications.flatMap(({ messages, travelRequestId }) =>
            messages.map(({ text, messageId, status }) => ({
                message: text,
                messageId,
                status,
                travelRequestId
            }))
        );
        
    } catch (error) {
        console.error('Error fetching employee notifications:', error);
        throw new Error('Could not fetch notifications.'); 
    }
};



const markMessageAsRead = async (req,res) => {
    try {
        const {messageId, travelRequestId} = req.params
        if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(404).json({success:false, message:'Invalid notification ID.'});
        }

        const notification = await Notification.findOne(travelRequestId);

        if (!notification) {
            return res.status(404).json({success:false, message:'Notification not found.'});
        }

        const message = notification.messages.find(msg => msg.messageId.toString() === messageId);

        if (!message) {
            return res.status(404).json({success:false, message:'Message not found for the provided travelRequestId.'});
        }

        if (message.isRead) {
            return res.status(200).json({success:true});
        }

        message.isRead = true;
        await notification.save();

        return res.status(200).json({success:true})
    } catch (error) {
        throw error; 
    }
};


export {
    fetchEmployeeNotifications,
    markMessageAsRead
}




