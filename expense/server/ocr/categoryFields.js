import HRMaster from "../models/hrCompanySchema.js"
import Joi from 'joi'

const inputSchema = Joi.object({
    tenantId: Joi.string().required(),
    travelType: Joi.string().required(),
    expenseCategory: Joi.string().required()
})

export const getExpenseCategoryFields = async (tenantId, travelType, expenseCategory) => {
    try {

    const { error} = inputSchema.validate({tenantId, travelType, expenseCategory})

    if (error) {
        throw new Error ( `validation Error: ${error.details[0].message}` );
    }

    console.log("getExpenseCategoryFields",tenantId, travelType, expenseCategory)

    const employeeDocument = await HRMaster.findOne({
        tenantId,
    });

      // Return error response if employee document is not found
    if (!employeeDocument) {
        throw new Error({
        success: false,
        message: 'Error Occurred while fetching expense category fields',
        });
    }

    // Extract additional information from the employee document
    const { travelExpenseCategories={} } = employeeDocument;

 // Convert input categories to lowercase for case-insensitive comparison
 const lowerCaseTravelExpenseCategory = travelType.toLowerCase();
 const lowerCaseExpenseCategory = expenseCategory.toLowerCase();

 // Flatten the array of category objects to a single array of values
 const flattenedCategories = travelExpenseCategories.flatMap(categoryObject => {
   const key = Object.keys(categoryObject).find(
     key => key.toLowerCase() === lowerCaseTravelExpenseCategory
   );
   return key ? categoryObject[key] : [];
 });

 // Find the expense object within the flattened array
 const expenseObject = flattenedCategories.find(
   expense => expense.categoryName.toLowerCase() === lowerCaseExpenseCategory
 );

 const  fields = expenseObject ? expenseObject.fields : null

 console.log("return",
    tenantId,
    travelType,
    expenseCategory,
    fields)
      // Return the response with the extracted information
      return ({
        tenantId,
        travelType,
        expenseCategory,
        fields,
      }); 
    } catch (error) {
      console.error('Error fetching Expense category Fields:', error);
      throw new Error({
        success: false,
        message: 'Internal Server Error',
        error: error.message || 'Something went wrong',
      });
    }
};







