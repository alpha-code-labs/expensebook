import Joi from "joi";
import Notification from "../models/notification.js";
import EXPENSE_NOTIFICATION from "../models/reimbursementNotification.js";


const fetchEmployeeNotifications = async (tenantId, empId, applicableRoles) => {
    try {
        console.log("applicableRoles", applicableRoles);
        let setEmployee = [];
        let setEmployeeManager = [];
        let setFinance = [];
        let setBusinessAdmin = [];
        let superAdmin=[]

        if (applicableRoles.includes('employee')) {
            const getEmployee = await Notification.find({ tenantId, 'employee.empId': empId });
            
            if (getEmployee && getEmployee.length > 0) {
                setEmployee = getEmployee.flatMap(({ messages, travelRequestId }) => 
                    messages.map(({ text, messageId, status,isRead,createdAt }) => ({
                        message: text,
                        messageId,
                        status,
                        isRead,
                        createdAt,
                        travelRequestId
                    }))
                );
            }
        }

        if (applicableRoles.includes('employeeManager')) {
            const getApprover = await Notification.find({ tenantId, 'approvers.empId': empId });
            
            if (getApprover && getApprover.length > 0) {
                setEmployeeManager = getApprover.flatMap(({ messages, travelRequestId }) => 
                    messages.map(({ text, messageId, status,isRead,createdAt }) => ({
                        message: text,
                        messageId,
                        status,
                        isRead,
                        createdAt,
                        travelRequestId
                    }))
                );
            }
            const getNotifications = await EXPENSE_NOTIFICATION.find({ tenantId, 'approvers.empId': empId });

            if (getNotifications && getNotifications.length > 0) {
                setEmployeeManager = [
                    ...setEmployeeManager,
                    ...getNotifications.flatMap(({ messages }) => 
                        messages.map(({ text, messageId, status, isRead, createdAt }) => ({
                            message: text,
                            messageId,
                            status,
                            isRead,
                            createdAt,
                        }))
                    )
                ];
            }
        }

        if(applicableRoles.includes('finance')){
            setFinance=[]
        }

        if(applicableRoles.includes('businessAdmin')){
            setBusinessAdmin=[]
        }

        const roleSets = {
            employee: setEmployee,
            employeeManager: setEmployeeManager,
            finance: setFinance,
            businessAdmin: setBusinessAdmin,
            superAdmin: superAdmin
        };

    console.log("applicableRoles", applicableRoles);

    const rolesToReturn = {};

    for (const role of applicableRoles) {
    if (roleSets[role]) {
        rolesToReturn[role] = roleSets[role];
    }
    }

    return Object.keys(rolesToReturn).length > 0 ? rolesToReturn : null;

    } catch (error) {
        console.error('Error fetching employee notifications:', error);
        throw new Error('Could not fetch notifications.'); 
    }
};



const validationSchema = Joi.object({
    messageId: Joi.string()
        .required()
        .messages({
            'string.base': 'Message ID must be a string.',
            'string.empty': 'Message ID is mandatory.',
            'any.required': 'Message ID is mandatory.'
        }),
    travelRequestId: Joi.string()
        .optional()
        .messages({
            'string.base': 'Travel Request ID must be a string.'
        }),
    expenseHeaderId: Joi.string()
        .optional()
        .messages({
            'string.base': 'Expense Header ID must be a string.'
        })
}).xor('travelRequestId', 'expenseHeaderId')
  .messages({
      'object.xor': 'Either Travel Request ID or Expense Header ID must be provided, but not both.'
  });



const markMessageAsRead = async (req, res) => { 
    try {
        const { value,error } = validationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }
        const { messageId, travelRequestId, expenseHeaderId } = value;

        if (!messageId) {
            return res.status(400).json({ success: false, message: 'Message ID is mandatory' });
        }

        let notification;

        if (travelRequestId) {
            notification = await Notification.findOne({ travelRequestId });
        } else if (expenseHeaderId) {
            notification = await EXPENSE_NOTIFICATION.findOne({ expenseHeaderId });
        } else {
            return res.status(400).json({ success: false, message: 'Either travelRequestId or expenseHeaderId is mandatory' });
        }

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found.' });
        }

        const message = notification.messages.find(msg => msg.messageId.toString() === messageId.toString());

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found for the provided IDs.' });
        }

        if (message.isRead) {
            return res.status(200).json({ success: true });
        }

        message.isRead = true;
        await notification.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



export {
    fetchEmployeeNotifications,
    markMessageAsRead
}




