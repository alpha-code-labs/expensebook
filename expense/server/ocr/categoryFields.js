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

    if (!employeeDocument) {
        throw new Error({
        success: false,
        message: 'Error Occurred while fetching expense category fields',
        });
    }

    const { travelExpenseCategories={} } = employeeDocument;

//  // Convert input categories to lowercase for case-insensitive comparison
//  const lowerCaseTravelExpenseCategory = travelType.toLowerCase();
//  const lowerCaseExpenseCategory = expenseCategory.toLowerCase();

//  // Flatten the array of category objects to a single array of values
//  const flattenedCategories = travelExpenseCategories.flatMap(categoryObject => {
//    const key = Object.keys(categoryObject).find(
//      key => key.toLowerCase() === lowerCaseTravelExpenseCategory
//    );
//    return key ? categoryObject[key] : [];
//  });


//  // Find the expense object within the flattened array
//  const expenseObject = flattenedCategories.find(
//    expense => expense.categoryName.toLowerCase() === lowerCaseExpenseCategory
//  );

//  const  fields = expenseObject ? expenseObject.fields : null

const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');

const lowerCaseTravelExpenseCategory = normalizeString(travelType);
const lowerCaseExpenseCategory = normalizeString(expenseCategory);


const flattenedCategories = travelExpenseCategories.flatMap(categoryObject => {
    const key = Object.keys(categoryObject).find(
        key => normalizeString(key) === lowerCaseTravelExpenseCategory
    );
    return key ? categoryObject[key] : [];
});

// console.log("Flattened categories:", flattenedCategories);

const expenseObject = flattenedCategories.find(
    expense => {
        const normalizedCategoryName = normalizeString(expense.categoryName);
        console.log("Checking normalized expense object:", normalizedCategoryName);
        return normalizedCategoryName === lowerCaseExpenseCategory;
    }
);

// console.log("Expense object:", expenseObject);

const fields = expenseObject ? expenseObject.fields : null;

console.log("Fields:", fields);


//  console.log("return",
//     tenantId,
//     travelType,
//     expenseCategory,
//     fields)

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







