import Finance from "../models/Finance.js";


//All Expense Header Reports with status as pending Settlement(Full Trip).
export const getTravelExpenseData = async(req , res)=>{
    try {
      const {tenantId} = req.params

      const status = {
        PENDING_SETTLEMENT:'pending settlement',
      }

        const expenseReportsToSettle = await Finance.find({
          tenantId,
          'tripSchema.travelExpenseData':{
            $elemMatch:{
              'actionedUpon': false,
              'expenseHeaderStatus':status.PENDING_SETTLEMENT
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

//Expense Header Reports with status as pending Settlement updated to paid(Full Trip).
export const paidExpenseReports = async (req, res) => {
  const { tenantId, travelRequestId, expenseHeaderId } = req.params;
  const { paidBy } = req.body;

  console.log("Received Parameters:", { tenantId, travelRequestId, expenseHeaderId });
  console.log("Received Body Data:", { paidBy });

  if (!tenantId || !travelRequestId || !expenseHeaderId || !paidBy) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  const status = {
    PENDING_SETTLEMENT:'pending settlement'
  };

  const newStatus ={
    PAID: 'paid',
  }

  const filter = {
    tenantId,
    travelRequestId,
    'tripSchema.travelExpenseData': {
      $elemMatch: {
        expenseHeaderId,
        expenseHeaderStatus: status.PENDING_SETTLEMENT,
        actionedUpon: false
      }
    }
  }

  try {
    const expenseReport = await Finance.findOne(filter);

    if (!expenseReport) {
      return res.status(404).json({ message: 'No matching document found' });
    }

    const expenseHeaderIndex = expenseReport.tripSchema?.travelExpenseData.findIndex(
      (expense) => JSON.stringify(expense.expenseHeaderId) === JSON.stringify(expenseHeaderId)
    )

    if (expenseHeaderIndex === -1) {
      return res.status(404).json({ message: 'No matching cash advance found' });
    }

    const updateResult = await Finance.updateOne(
      filter,
      {
        $set: {
          'tripSchema.travelExpenseData.$[elem].paidBy': paidBy,
          'tripSchema.travelExpenseData.$[elem].actionedUpon': true,
          'tripSchema.travelExpenseData.$[elem].expenseHeaderStatus': newStatus.PAID
        }
      },
      {
        arrayFilters: [{ 'elem.expenseHeaderId': expenseHeaderId }],
        new: true
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching document found for update' });
    }

    console.log("Update successful:", updateResult);
    return res.status(200).json({ message: 'Update successful', result: updateResult });
  } catch (error) {
    console.error('Error updating cashAdvance status:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
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



