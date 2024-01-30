import  CashAdvance from "../models/cashAdvance.js";

 const getCashAdvanceData = async(req , res)=>{
    try { 
        const singleCashAdvanceData = await CashAdvance.find({actionedUpon:"No"});
        res.status(200).json(singleCashAdvanceData);
    } catch (error) {
        res.status(500).json(error);
    }
};

 const settlement = async(req , res)=>{
    // console.log("LINE AT 15" , req.body);
    const {tenantId , travelRequestId} = req.params;
    console.log("LINE AT 17" , tenantId);
    const id = req.body._id;
    // console.log("LINE AT 17" , id);

    try {
    const singleCashAdvanceUpdate = await CashAdvance.findOneAndUpdate(
        {tenantId:tenantId},  {travelRequestId : travelRequestId},
           {$set: {settlementFlag: true}} , // Update only the cashAdvanceStatus field
           { new: true } 
      );
  
      if (!singleCashAdvanceUpdate) {
        return res.status(404).json({ message: `Element not found` });
      }
      res.status(200).json(singleCashAdvanceUpdate);
    } catch (error) {
      console.log("LINE AT 30" , error.message);
      res.status(500).json(error);
    }
};

 const unSettlement = async(req , res)=>{
    // console.log("LINE AT 37" , req.body);
    const {tenantId , travelRequestId} = req.params;
    const id = req.body._id;
    // console.log("LINE AT 39" , id);

    try {
    const singleCashAdvanceUpdateAgain = await CashAdvance.findOneAndUpdate(
        {tenantId :tenantId } , {travelRequestId : travelRequestId} ,
           {$set: {settlementFlag: false}} , // Update only the cashAdvanceStatus field
           { new: true } 
      );
  
      if (!singleCashAdvanceUpdateAgain) {
        return res.status(404).json({ message: `Element not found` });
      }
      res.status(200).json(singleCashAdvanceUpdateAgain);
    } catch (error) {
      console.log("LINE AT 53" , error.message);
      res.status(500).json(error);
    }
}
export {getCashAdvanceData , settlement , unSettlement};