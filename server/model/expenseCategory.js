import mongoose from "mongoose";


const ExpenseCategorySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  expenseCategories: [
    {
      HeadersName: String,
      values: [String],
    },
  ],
})

const ExpenseCategory = mongoose.model('ExpenseCategorySchema', ExpenseCategorySchema);

export default  ExpenseCategory
