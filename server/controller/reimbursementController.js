import Finance from "../models/Finance.js";

export const getReimbursement = async(tenantId, empId)=>{
    try {
      // const {tenantId}= req.params
      console.log("tenantId", tenantId)

      const status = {
        PENDING_SETTLEMENT:"pending settlement",
      }

        const getNonTravelExpenseReports = await Finance.find({
          'reimbursementSchema.tenantId': tenantId,
          'reimbursementSchema.actionedUpon': false
      });

        if(!getNonTravelExpenseReports){
          return {success:true, message: `All are settled` };
        } else{

      console.log("non travel",getNonTravelExpenseReports )
      const nonTravelExpense = getNonTravelExpenseReports.map((report) => {
        // console.log("reports expense", JSON.stringify(report, null, 2)); 
      
        const {
          expenseHeaderId,
          actionedUpon,
          settlementBy,
          expenseHeaderStatus,
          createdBy
        } = report.reimbursementSchema;
      
        const { expenseAmountStatus } = report;
      
        return {
          expenseHeaderId,
          expenseHeaderStatus,
          expenseAmountStatus,
          createdBy,
          settlementBy,
          actionedUpon
        };
      });
      
      console.log("nonTravelExpense", JSON.stringify(nonTravelExpense, null, 2));
      return nonTravelExpense;
        }
    } catch (error) {
        throw new Error ({error: 'Error in  fetching non travel expense reports', error});
    }
};

//Expense Header Reports with status as pending Settlement updated to paid(Non Travel Expense Reports).
export const paidNonTravelExpenseReports = async (req, res) => {
  const { tenantId, expenseHeaderId } = req.params;
  const { settlementBy } = req.body;

  console.log("Received Parameters:", { tenantId, expenseHeaderId });
  console.log("Received Body Data: non travel", { settlementBy });

  if (!tenantId || !expenseHeaderId || !settlementBy) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  const status = {
    PENDING_SETTLEMENT:'pending settlement' 
  };

  const newStatus ={
    PAID: 'paid',
  }

  const filter = {
    'reimbursementSchema.tenantId':tenantId,
    'reimbursementSchema.expenseHeaderId':expenseHeaderId,
    'reimbursementSchema.expenseHeaderStatus':status.PENDING_SETTLEMENT,
    'reimbursementSchema.actionedUpon':false
  }

  try {
    const expenseReport = await Finance.findOne(filter);

    if (!expenseReport) {
      return res.status(404).json({ message: 'No matching document found' });
    }

    const isExpenseHeaderId = expenseReport.reimbursementSchema?.expenseHeaderId === expenseHeaderId

  if (!isExpenseHeaderId) {
   return res.status(404).json({ message: 'No matching document found' });
   } else {
    const updateResult = await Finance.updateOne(
      filter,
      {
        $set: {
          'reimbursementSchema.settlementBy': settlementBy,
          'reimbursementSchema.actionedUpon': true,
          'reimbursementSchema.expenseHeaderStatus': newStatus.PAID
        }
      },
      {
        new: true
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: 'No matching document found for update' });
    }

    console.log("Update successful:", updateResult);
    return res.status(200).json({ message: 'Update successful', result: updateResult });
    }

  } catch (error) {
    console.error('Error updating non travel expense report status:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const settlementReimbursement = async(req , res)=>{
// console.log("LINE AT 15" , req.body);
const id = req.body._id;
// console.log("LINE AT 15" , id);

try {
const singleReimbursementUpdate = await Finance.findByIdAndUpdate(
    id,
       {$set: { 'reimbursement.settlementFlag': true}} , // Update only the cashAdvanceStatus field
       { new: true } 
  );

  if (!singleReimbursementUpdate) {
    return res.status(404).json({ message: `Element not found` });
  }
  res.status(200).json(singleReimbursementUpdate);
} catch (error) {
  console.log("LINE AT 30" , error.message);
  res.status(500).json(error);
}
};

export const unSettlementReimbursement = async(req , res)=>{
     // console.log("LINE AT 37" , req.body);
     const id = req.body._id;
     // console.log("LINE AT 39" , id);
 
     try {
     const singleReimbursementUpdateAgain = await Finance.findByIdAndUpdate(
         id,
            {$set: { 'reimbursement.settlementFlag': false}} , // Update only the cashAdvanceStatus field
            { new: true } 
       );
   
       if (!singleReimbursementUpdateAgain) {
         return res.status(404).json({ message: `Element not found` });
       }
       res.status(200).json(singleReimbursementUpdateAgain);
     } catch (error) {
       console.log("LINE AT 53" , error.message);
       res.status(500).json(error);
     }
};








