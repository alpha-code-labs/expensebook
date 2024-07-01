import Finance from "../models/Finance.js";


//All Expense Header Reports with status as pending Settlement(Full Trip).
export const getTravelExpenseData = async(tenantId, empId)=>{
    try {
      // const {tenantId} = req.params

      const status = {
        PENDING_SETTLEMENT:'pending settlement',
      }

        const expenseReportsToSettle = await Finance.find({
          tenantId,
          'tripSchema.travelExpenseData':{
            $elemMatch:{
              $or:[
                {'paidFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
                {'recoveredFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT}
              ]
            }
          },
        });

        if (!expenseReportsToSettle) {
          return { success: true, message: `All are settled` };
      } else {

      const travelExpense = expenseReportsToSettle.flatMap((report) =>{
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }
      const {expenseAmountStatus, createdBy} = report.tripSchema

        return report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PENDING_SETTLEMENT)
        .map(({travelRequestId,expenseHeaderId, paidBy,recoveredBy, paidFlag, recoveryFlag})=>({
          expenseAmountStatus,
          travelRequestId,
          expenseHeaderId,
          createdBy,
          paidBy,
          recoveredBy,
          paidFlag,
          recoveryFlag
          }))
      })

      console.log("travelExpense",travelExpense)
      return travelExpense

    }} catch (error) {
      throw new Error({ error: 'Error in fetching travel expense reports:', error });
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
      $or: [
        { expenseHeaderId,'paidFlag': false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
        { expenseHeaderId,'recoveredFlag': false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT }
      ]
    }
  }
}

const update = {
  $set: {
    'tripSchema.travelExpenseData.$[elem].paidFlag': true,
    'tripSchema.travelExpenseData.$[elem].paidBy': paidBy,
    'tripSchema.travelExpenseData.$[elem].actionedUpon': true,
    'tripSchema.travelExpenseData.$[elem].expenseHeaderStatus': newStatus.PAID
  }
}

  try {
    const expenseReport = await Finance.findOne(filter);

    if (!expenseReport) {
      return res.status(404).json({ message: 'No matching document found' });
    }

    const {expenseAmountStatus} = expenseReport.tripSchema

    const {totalRemainingCash} = expenseAmountStatus


    const expenseHeaderIndex = expenseReport.tripSchema?.travelExpenseData.findIndex(
      (expense) => JSON.stringify(expense.expenseHeaderId) === JSON.stringify(expenseHeaderId)
    )

    if (expenseHeaderIndex === -1) {
      return res.status(404).json({ message: 'No matching cash advance found' });
    }

    const updateResult = await Finance.updateOne(
      filter,
      update,
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





