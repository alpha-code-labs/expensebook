import Joi from 'joi';

const editParamsSchema = Joi.object({
    tenantId: Joi.string().required(),
    tripId: Joi.string().required(),
    empId: Joi.string().required(),
    expenseHeaderId: Joi.string().required(),
});

const editBodySchema = Joi.object({
    travelType: Joi.string().valid('international', 'domestic', 'local').required(),
    expenseAmountStatus: Joi.object({
        totalCashAmount:Joi.number().optional(),
        totalExpenseAmount: Joi.number().optional(),
        totalPersonalExpenseAmount: Joi.number().optional(),
        totalRemainingCash: Joi.number().optional(),
        totalAlreadyBookedExpenseAmount: Joi.number().optional()
    }).optional(),
    expenseLine: Joi.object().required(),
    expenseLineEdited: Joi.object().required(),
    allocations: Joi.array().items(Joi.object()).optional(),
});


const validateRequest = (paramSchema, bodySchema) => {
    return (req, res, next) => {
        const { error: paramError } = paramSchema.validate(req.params);
        if (paramError) {
            return res.status(400).json({ message: paramError.details[0].message });
        }

        const { error: bodyError } = bodySchema.validate(req.body);
        if (bodyError) {
            return res.status(400).json({ message: bodyError.details[0].message });
        }

        next(); 
    };
};

export{
    validateRequest,
    editParamsSchema,
    editBodySchema
}