import Finance from "../models/Finance.js";
 
//All Expense Header Reports with status as pending Settlement (Full Trip).
export const getTravelExpenseData = async(req , res)=>{
    try {
      const {tenantId} = req.params

      const status = {
        PENDING_SETTLEMENT:'pending settlement'
      }

      const expenseStatus = Object.values(status)

        const expenseReportsToSettle = await Finance.find({
          tenantId,
          'tripSchema.travelExpenseData':{
            $elemMatch:{
              'actionedUpon': false,
              'expenseHeaderStatus':{
                $in:expenseStatus
              }
            }
          },
        });

        if (!expenseReportsToSettle) {
          return res.status(201).json({ success: true, message: `All are settled` });
      } else {
          return res.status(200).json(expenseReportsToSettle);
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