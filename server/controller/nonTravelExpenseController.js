import  nonTravelExpense from "../models/nonTravelExpense.js" ;
 
export const getNonTravelExpenseData = async(req , res)=>{
    try {
        const singleNonTravelExpenseData = await nonTravelExpense.find();
        res.status(200).json(singleNonTravelExpenseData)
    } catch (error) {
        res.status(500).json(error);
    }
};

export const settlementNonTravelExpenseData = async(req , res)=>{
// console.log("LINE AT 15" , req.body);
const id = req.body._id;
// console.log("LINE AT 15" , id);

try {
const singleNonTravelExpenseDataUpdate = await nonTravelExpense.findByIdAndUpdate(
    id,
       {$set: {settlementFlag: true}} , // Update only the cashAdvanceStatus field
       { new: true } 
  );

  if (!singleNonTravelExpenseDataUpdate) {
    return res.status(404).json({ message: `Element not found` });
  }
  res.status(200).json(singleNonTravelExpenseDataUpdate);
} catch (error) {
  console.log("LINE AT 30" , error.message);
  res.status(500).json(error);
}
};

export const unSettlementNonTravelExpenseData = async(req , res)=>{
     // console.log("LINE AT 37" , req.body);
     const id = req.body._id;
     // console.log("LINE AT 39" , id);
 
     try {
     const singleNonTravelExpenseDataUpdateAgain = await nonTravelExpense.findByIdAndUpdate(
         id,
            {$set: {settlementFlag: false}} , // Update only the cashAdvanceStatus field
            { new: true } 
       );
   
       if (!singleNonTravelExpenseDataUpdateAgain) {
         return res.status(404).json({ message: `Element not found` });
       }
       res.status(200).json(singleNonTravelExpenseDataUpdateAgain);
     } catch (error) {
       console.log("LINE AT 53" , error.message);
       res.status(500).json(error);
     }
};