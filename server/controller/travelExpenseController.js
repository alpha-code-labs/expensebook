import Joi from "joi";
import Finance from "../models/Finance.js";
import { financeSchema, sendUpdate } from "./cashAdvanceController.js";


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
              'actionedUpon':false,
              'expenseHeaderStatus':status.PENDING_SETTLEMENT
              // $or:[
              //   {'paidFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
              //   {'recoveredFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT}
              // ]
            }
          },
        });

        if (!expenseReportsToSettle) {
          return { success: true, message: `All are settled` };
      } else {

      const travelExpense = expenseReportsToSettle.flatMap((report) =>{
        // console.log("reports expense", report)
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }
      const {travelRequestId,tripName} = report?.tripSchema?.travelRequestData
      const {expenseAmountStatus, createdBy} = report.tripSchema

      const travelExpenseData = report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PENDING_SETTLEMENT)
        .map(({expenseHeaderId, expenseHeaderNumber,actionedUpon,settlementBy ,defaultCurrency, expenseHeaderStatus})=>({
          expenseHeaderStatus,
          expenseAmountStatus,
          expenseHeaderId,
          expenseHeaderNumber,
          defaultCurrency,
          settlementBy,
          actionedUpon
          }))

          return {tripName,travelRequestId,expenseAmountStatus, createdBy,travelExpenseData}
      })

      // console.log("travelExpense",travelExpense)
      return travelExpense

    }} catch (error) {
      throw new Error({ error: 'Error in fetching travel expense reports:', error });
    }
};

const cashSchema = Joi.object({
  tenantId:Joi.string().required(),
  travelRequestId:Joi.string().required(),
  expenseHeaderId: Joi.string().required(),
})

//Expense Header Reports with status as pending Settlement updated to paid(Full Trip).
// export const paidExpenseReports = async (req, res, next) => {
// const [params, body] = await Promise.all([
//   cashSchema.validateAsync(req.params),
//   settlementSchema.validateAsync(req.body)
// ])
//   const { tenantId, travelRequestId, expenseHeaderId } = params;
//   const { settlementBy } = body;

//   console.log("Received Parameters:", { tenantId, travelRequestId, expenseHeaderId });
//   console.log("Received Body Data:", { settlementBy });

//   if (!tenantId || !travelRequestId || !expenseHeaderId || !settlementBy) {
//     return res.status(400).json({ message: 'Missing required field' });
//   }

//   const status = {
//     PENDING_SETTLEMENT:'pending settlement'
//   };

//   const newStatus ={
//     PAID: 'paid',
//   }

//   const filter = {
//     tenantId,
//     travelRequestId,
//     'tripSchema.travelExpenseData': {
//       $elemMatch: {
//         expenseHeaderId,
//         'expenseHeaderStatus': status.PENDING_SETTLEMENT,
//         actionedUpon:false,
//       // $or: [
//       //   { expenseHeaderId,'paidFlag': false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
//       //   { expenseHeaderId,'recoveredFlag': false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT }
//       // ]
//     }
//   }
// }

// const update = {
//   $set: {
//     'tripSchema.travelExpenseData.$[elem].settlementBy': settlementBy,
//     'tripSchema.travelExpenseData.$[elem].actionedUpon': true,
//     'tripSchema.travelExpenseData.$[elem].expenseHeaderStatus': newStatus.PAID,
//     'tripSchema.travelExpenseData.$[elem].submissionDate': new Date(), // IMPORTANT --this need to be renamed as paidDate , for report extraction testing purpose added submission date
//   }
// }

// const arrayFilters = {
//   arrayFilters: [{ 'elem.expenseHeaderId': expenseHeaderId }],
//   new: true
// }

//   try {
//     const expenseReport = await Finance.findOne(filter);

//     if (!expenseReport) {
//       return res.status(404).json({ message: 'No matching document found' });
//     }

//     const {expenseAmountStatus} = expenseReport.tripSchema

//     const {totalRemainingCash} = expenseAmountStatus

//     const expenseHeaderIndex = expenseReport.tripSchema?.travelExpenseData.findIndex(
//       (expense) => JSON.stringify(expense.expenseHeaderId) === JSON.stringify(expenseHeaderId)
//     )

//     if (expenseHeaderIndex === -1) {
//       return res.status(404).json({ message: 'No matching cash advance found' });
//     }

//     const updateResult = await Finance.updateOne(
//       filter,
//       update,
//       arrayFilters
//     );

//     if (updateResult.modifiedCount === 0) {
//       return res.status(404).json({ message: 'No matching document found for update' });
//     }

//     console.log("Update successful:", updateResult);
//     return res.status(200).json({ message: 'Update successful', result: updateResult });
//   } catch (error) {
//     console.error('Error updating cashAdvance status:', error.message);
//     next(error)
//   }
// };

export const paidExpenseReports = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const [params, body] = await Promise.all([
      cashSchema.validateAsync(req.params),
      financeSchema.validateAsync(req.body)
    ]);
    
    const { tenantId, travelRequestId, expenseHeaderId } = params;
    const { getFinance } = body;

    // console.log("Received Parameters:", { tenantId, travelRequestId, expenseHeaderId });
    // console.log("Received Body Data:", { getFinance });

    const status = {
      PENDING_SETTLEMENT: 'pending settlement',
      PAID: 'paid',
      APPROVED:'approved'
    };

    const newStatus = {
      PAID: 'paid'
    };

    const filter = {
      tenantId,
      travelRequestId,
      'tripSchema.travelExpenseData': {
        $elemMatch: {
          expenseHeaderId,
          'expenseHeaderStatus': status.PENDING_SETTLEMENT,
          actionedUpon: false
        }
      }
    };

    const update = {
      $set: {
        'tripSchema.travelExpenseData.$[elem].settlementBy': getFinance,
        'tripSchema.travelExpenseData.$[elem].actionedUpon': true,
        'tripSchema.travelExpenseData.$[elem].expenseHeaderStatus': newStatus.PAID,
        'tripSchema.travelExpenseData.$[elem].settlementDate': new Date(), // Renaming this to paidDate is required
        'tripSchema.travelExpenseData.$[elem].expenseLines.$[lineItem].lineItemStatus': newStatus.PAID
      }
    };

    const arrayFilters = [
      {'elem.expenseHeaderId': expenseHeaderId },
      {'lineItem.lineItemStatus':status.APPROVED}
    ];

    const updatedExpenseReport = await Finance.findOneAndUpdate(
      filter,
      update,
      {
        arrayFilters,
        new: true,
        runValidators: true
      }
    );

    if (!updatedExpenseReport) {
      return res.status(404).json({ message: 'No matching document found or update failed' });
    }

    const payload = {
      tenantId,travelRequestId, expenseHeaderId, settlementBy:getFinance , expenseHeaderStatus:newStatus.PAID , 
      settlementDate: new Date(),
    }

    const options={
     action:'expense-paid',
     comments:'travelExpenseReport status is updated to paid',
     includeTrip:true,
    }

    console.log("Update successful:", updatedExpenseReport);
    await sendUpdate(payload,options)
    return res.status(200).json({ message: 'Update successful', result: updatedExpenseReport });
  } catch (error) {
    console.error('Error updating expense report status:', error.message);
    next(error); 
  }
};


export const getAllPaidForEntries = async(req,res,next) => {
    try {
      const {tenantId, empId} = req.params

      const status = {
        PAID:'paid',
      }

        const expenseReportsToSettle = await Finance.find({
          tenantId,
          'tripSchema.travelExpenseData':{
            $elemMatch:{
              'actionedUpon':false,
              'expenseHeaderStatus':status.PAID
              // $or:[
              //   {'paidFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT },
              //   {'recoveredFlag':false, 'expenseHeaderStatus': status.PENDING_SETTLEMENT}
              // ]
            }
          },
        });

        if (!expenseReportsToSettle) {
          return { success: true, message: `All are settled` };
      } else {

      const travelExpense = expenseReportsToSettle.flatMap((report) =>{
        // console.log("reports expense", report)
        if(!report?.tripSchema || !report?.tripSchema?.travelExpenseData?.length > 1){
          return []
      }
      const {travelRequestId,travelRequestNumber, tripName} = report?.tripSchema?.travelRequestData 
      const {expenseAmountStatus, createdBy} = report?.tripSchema

       const getTravelExpenseData =  report.tripSchema.travelExpenseData
        .filter((expense) => expense.expenseHeaderStatus === status.PENDING_SETTLEMENT)
        .map(({expenseHeaderId,expenseHeaderNumber,actionedUpon,settlementBy , expenseHeaderStatus})=>({
          expenseHeaderStatus,
          expenseAmountStatus,
          travelRequestId,
          expenseHeaderId,
          expenseHeaderNumber,
          settlementBy,
          actionedUpon
          }))

          return{travelRequestId,tripName, travelRequestNumber,expenseAmountStatus,createdBy, travelExpenseData:getTravelExpenseData}

      })

      console.log("travelExpense",travelExpense)
      return travelExpense

    }} catch (error) {
      next(error)
      return res.status(500).json({ error: 'Error in fetching travel expense reports:',error: error.message });
    }
};











