import Finance from "../models/Finance.js";
 
export const getTravelExpenseData = async(req , res)=>{
    try {
      const {tenantId} = req.params
        const singletravelExpenseData = await Finance.find({
          tenantId,
          'tripSchema.travelExpenseData.actionedUpon':false
        });

        if (!singletravelExpenseData) {
          return res.status(201).json({ success: true, message: `All are settled` });
      } else {
          return res.status(200).json(singleReimbursement);
      }
    } catch (error) {
        res.status(500).json(error);
    }
};


export const settlementTravelExpenseData = async(req , res)=>{
        try {
        const { tenantId, travelRequestId, expenseHeaderId} = req.params;
        const{ settledBy} = req.body

        // console.log("LINE AT 15" , id);
         const singletravelExpenseDataUpdate = await Finance.findByIdAndUpdate({
            'tripSchema.travelExpenseData.expenseHeaderId': expenseHeaderId,
          },{
            $set: {          
                'tripSchema.travelExpenseData.actionedUpon':true,
                'tripSchema.travelExpenseData.settlementFlag':true
            }},
               { new: true } 
          );
      
          if (!singletravelExpenseDataUpdate) {
            return res.status(404).json({ message: `Element not found` });
          }
          res.status(200).json(singletravelExpenseDataUpdate);
        } catch (error) {
          console.log("LINE AT 30" , error.message);
          res.status(500).json(error);
        }
};

export const unSettlementTravelExpenseData = async(req , res)=>{
       // console.log("LINE AT 37" , req.body);
       const id = req.body._id;
       // console.log("LINE AT 39" , id);
   
       try {
       const singletravelExpenseDataUpdateAgain = await travelExpense.findByIdAndUpdate(
           id,
              {$set: {settlementFlag: false}} , // Update only the cashAdvanceStatus field
              { new: true } 
         );
     
         if (!singletravelExpenseDataUpdateAgain) {
           return res.status(404).json({ message: `Element not found` });
         }
         res.status(200).json(singletravelExpenseDataUpdateAgain);
       } catch (error) {
         console.log("LINE AT 53" , error.message);
         res.status(500).json(error);
       }
}