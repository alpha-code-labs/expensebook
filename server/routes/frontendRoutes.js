import express from 'express';
// import  getNonTravelExpense from '../controllers/dashboardControllers.js';
import nonTravelExpense1 from '../dummyData/nonTravelExpense.js';

const router =express.Router();


router.get('/get-non-travel-expense/:expenseHeaderId', async (req, res) => {
   
    

try{
    const {expenseHeaderId }=req.params
    const nonTravelExpenseData=nonTravelExpense1.find((data)=>data.expenseHeaderId=== expenseHeaderId )
    if(!nonTravelExpenseData){
        return res.status(404).json({error: "Expense not found"})
    }else{
        return res.status(200).json(nonTravelExpenseData)
    }
    

    await res.status(200).json({message:nonTravelExpense1})
}catch(error){
    console.error({error:"Internal Server Error"})

}

   })


//    router.get('/get-expenses', (req, res) => {
//     try {
//       // Filter the expense data based on the specified statuses
//       const filteredExpenses = expense.filter((expenseItem) => {
//         return expenseItem.expenseStatus === 'paid' || expenseItem.expenseStatus === 'pending settlement';
//       });
  
//       // Return the filtered expense data
//       res.status(200).json({ expenses: filteredExpenses });
//     } catch (error) {
//       console.error({ error: "Internal Server Error" });
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });





router.get('/get-non-travel-expenses', (req, res) => {
    try {
      // Filter the non-travel expense data based on the specified statuses
      const filteredNonTravelExpenses = nonTravelExpense1.filter((expenseItem) => {
        return expenseItem.expenseStatus === 'paid' || expenseItem.expenseStatus === 'pending settlement';
      });
  
      // Return the filtered non-travel expense data
      res.status(200).json({ nonTravelExpenses: filteredNonTravelExpenses });
    } catch (error) {
      console.error({ error: "Internal Server Error" });
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


export default router;