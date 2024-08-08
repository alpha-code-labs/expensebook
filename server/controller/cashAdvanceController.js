import Joi from "joi";
import Finance from "../models/Finance.js";
import { handleErrors } from "../errorHandler/errorHandler.js";

export const getPaidAndCancelledCash = async(tenantId, empId)=>{
    try { 

      const cashStatus ={
        PAID_AND_CANCELLED :'paid and cancelled' 
      }

      const cashAdvanceReports = await Finance.find({
        'cashAdvanceSchema.cashAdvancesData.recoveryFlag': false,
        'cashAdvanceSchema.cashAdvancesData.tenantId':tenantId,
        'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:[cashStatus.PAID_AND_CANCELLED]}
        }
      );

      if(!cashAdvanceReports){
        return { success:true, message: `All are settled` };
      } else {

        const recoverCash = cashAdvanceReports.flatMap((report) => {
          if (!report.cashAdvanceSchema || !Array.isArray(report.cashAdvanceSchema.cashAdvancesData)) {
            return [];
          }
      
          return report.cashAdvanceSchema.cashAdvancesData
            .filter(cash => cash.cashAdvanceStatus === cashStatus.PAID_AND_CANCELLED)
            .map(({ travelRequestId, cashAdvanceId, cashAdvanceStatus, createdBy, amountDetails, recoveredBy, paidBy, actionedUpon }) => ({
              actionedUpon,
              travelRequestId,
              cashAdvanceId,
              createdBy,
              cashAdvanceStatus,
              amountDetails:amountDetails[0],
              recoveredBy,
              paidBy
            }));
        });
        // console.log("recoverCash", recoverCash)
        return recoverCash;

      }
    } catch (error) {
      console.error("Error in fetching paid and cancelled cashAdvance:", error);
      // Return an object indicating the error occurred
      throw new Error({ error: 'Error in fetching paid and cancelled cashAdvance', error });
  }
};

export const getCashAdvanceToSettle = async(tenantId, empId) => {
  try{
    console.log("tenantId",tenantId )
    const status = {
      PENDING_SETTLEMENT :'pending settlement',
    }

    const filterStatus = [
      status.PENDING_SETTLEMENT,
    ]

    const cashToSettle = Object.values(status)
    console.log("status", cashToSettle)

    const getAllCashToSettle = await Finance.find({
      'cashAdvanceSchema.cashAdvancesData.tenantId':tenantId,
      'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:cashToSettle},
      'cashAdvanceSchema.cashAdvancesData.paidFlag':false
    })

    if(!getAllCashToSettle){
      return {message:"All are settled", success: true}
    }else{

      const settleCash = getAllCashToSettle.flatMap((report) => {
          if (!report.cashAdvanceSchema || !Array.isArray(report.cashAdvanceSchema.cashAdvancesData)) {
            return [];
          }
      
          return report.cashAdvanceSchema.cashAdvancesData
            // .filter(cash => cash.cashAdvanceStatus === status.PENDING_SETTLEMENT || cash.cashAdvanceStatus === status.AWAITING_PENDING_SETTLEMENT)
            .filter(cash => filterStatus.includes(cash.cashAdvanceStatus) )
            .map(({ travelRequestId, cashAdvanceId, cashAdvanceStatus, createdBy, amountDetails, recoveredBy, paidBy, actionedUpon }) => ({
              actionedUpon,
              travelRequestId,
              cashAdvanceId,
              createdBy,
              cashAdvanceStatus,
              amountDetails:amountDetails[0],
              recoveredBy,
              paidBy
            }));
        });
        // console.log("settleCash", settleCash)
        return settleCash;
    }

  } catch(error){
    console.error("Error in fetching cashAdvance to settle:", error);
    throw new Error({ error: 'Error in fetching cashAdvance to settle:', error });

  }
}

//All Cash advances with status as pending settlement. 
// export const paidCashAdvance = async (req, res) => {
//   const { tenantId, travelRequestId, cashAdvanceId } = req.params;
//   const { paidBy } = req.body;

//   console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
//   console.log("Received Body Data:", { paidBy });

//   if (!tenantId || !travelRequestId || !cashAdvanceId || !paidBy) {
//     return res.status(400).json({ message: 'Missing required field' });
//   }

//   const status = {
//     PENDING_SETTLEMENT:'pending settlement'
//   };

//   const newStatus ={
//     PAID: 'paid',
//   }


//   try {
//     const travelRequest = await Finance.findOne({
//       tenantId,
//       travelRequestId,
//       'cashAdvanceSchema.cashAdvancesData': {
//         $elemMatch: {
//           cashAdvanceId,
//           cashAdvanceStatus: status.PENDING_SETTLEMENT,
//           paidFlag: false
//         }
//       }
//     });

//     if (!travelRequest) {
//       return res.status(404).json({ message: 'No matching document found' });
//     }

//     const cashAdvanceIndex = travelRequest.cashAdvanceSchema.cashAdvancesData.findIndex(
//       (item) => JSON.stringify(item.cashAdvanceId) === JSON.stringify(cashAdvanceId)
//     );

//     if (cashAdvanceIndex === -1) {
//       return res.status(404).json({ message: 'No matching cash advance found' });
//     }

//     const updateResult = await Finance.updateOne(
//       {
//         tenantId,
//         travelRequestId,
//         'cashAdvanceSchema.cashAdvancesData': {
//           $elemMatch: {
//             cashAdvanceId,
//             cashAdvanceStatus: status.PENDING_SETTLEMENT,
//             paidFlag: false
//           }
//         }
//       },
//       {
//         $set: {
//           'cashAdvanceSchema.cashAdvancesData.$[elem].paidBy': paidBy,
//           'cashAdvanceSchema.cashAdvancesData.$[elem].paidFlag': true,
//           'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': newStatus.PAID
//         }
//       },
//       {
//         arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
//         new: true
//       }
//     );

//     if (updateResult.modifiedCount === 0) {
//       return res.status(404).json({ message: 'No matching document found for update' });
//     }

//     console.log("Update successful:", updateResult);
//     return res.status(200).json({ message: 'Update successful', result: updateResult });
//   } catch (error) {
//     console.error('Error updating cashAdvance status:', error.message);
//     return res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };
const cashSchema = Joi.object({
  tenantId:Joi.string().required(),
  empId:Joi.string().required(),
  cashAdvanceId: Joi.string().required(),
})

const paidSchema = Joi.object({
  paidBy: Joi.object({
    empId: Joi.string().required(),
    name: Joi.string().required()
  })
})

export const paidCashAdvance = async (req, res) => {
  const [params,body]=await Promise.all([
    cashSchema.validateAsync(req.params),
    paidSchema.validateAsync(req.body)
  ])

  const { tenantId, travelRequestId, cashAdvanceId } = params;
  const { paidBy } = body;

  console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
  console.log("Received Body Data:", { paidBy });

  if (!tenantId || !travelRequestId || !cashAdvanceId || !paidBy) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  const STATUS = {
    PENDING_SETTLEMENT: 'pending settlement',
    PAID: 'paid'
  };

  try {
    const updateResult = await Finance.findOneAndUpdate(
      {
        tenantId,
        travelRequestId,
        'cashAdvanceSchema.cashAdvancesData': {
          $elemMatch: {
            cashAdvanceId,
            cashAdvanceStatus: STATUS.PENDING_SETTLEMENT,
            paidFlag: false
          }
        }
      },
      {
        $set: {
          'cashAdvanceSchema.cashAdvancesData.$[elem].paidBy': paidBy,
          'cashAdvanceSchema.cashAdvancesData.$[elem].paidFlag': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': STATUS.PAID
        }
      },
      {
        arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
        new: true
      }
    );

    if (!updateResult) {
      return res.status(404).json({ message: 'No matching document found for update' });
    }

    console.log("Update successful:", updateResult);
    return res.status(200).json({ message: 'Update successful', result: updateResult });
  } catch (error) {
    console.error("paidCashAdvance error",error.message)
    next(error);
  }
};

// All cash advances as status Paid and Cancelled. 
// export const recoverCashAdvance = async (req, res,next) => {
//   const { tenantId, travelRequestId, cashAdvanceId } = req.params;
//   const { recoveredBy } = req.body;

//   console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
//   console.log("Received Body Data:", { recoveredBy });

//   if (!tenantId || !travelRequestId || !cashAdvanceId || !recoveredBy) {
//     return res.status(400).json({ message: 'Missing required field' });
//   }

//   const status = {
//     PAID_AND_CANCELLED: 'paid and cancelled',
//     RECOVERED: 'recovered'
//   };

//   try {
//     const travelRequest = await Finance.findOne({
//       tenantId,
//       travelRequestId,
//       'cashAdvanceSchema.cashAdvancesData': {
//         $elemMatch: {
//           cashAdvanceId,
//           cashAdvanceStatus: status.PAID_AND_CANCELLED,
//           recoveryFlag: false
//         }
//       }
//     });

//     if (!travelRequest) {
//       return res.status(404).json({ message: 'No matching document found' });
//     }

//     const cashAdvanceIndex = travelRequest.cashAdvanceSchema.cashAdvancesData.findIndex(
//       (item) => JSON.stringify(item.cashAdvanceId) === JSON.stringify(cashAdvanceId)
//     );

//     if (cashAdvanceIndex === -1) {
//       return res.status(404).json({ message: 'No matching cash advance found' });
//     }

//     const updateResult = await Finance.updateOne(
//       {
//         tenantId,
//         travelRequestId,
//         'cashAdvanceSchema.cashAdvancesData': {
//           $elemMatch: {
//             cashAdvanceId,
//             cashAdvanceStatus: status.PAID_AND_CANCELLED,
//             recoveryFlag: false
//           }
//         }
//       },
//       {
//         $set: {
//           'cashAdvanceSchema.cashAdvancesData.$[elem].recoveredBy': recoveredBy,
//           'cashAdvanceSchema.cashAdvancesData.$[elem].recoveryFlag': true,
//           'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': status.RECOVERED
//         }
//       },
//       {
//         arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
//         new: true
//       }
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

const status = {
  PAID_AND_CANCELLED: 'paid and cancelled',
  RECOVERED: 'recovered'
};

const recoverSchema = Joi.object({
  tenantId:Joi.string().required(),
  travelRequestId: Joi.string().required(),
  cashAdvanceId: Joi.string().required()
})

const recoverBodySchema = Joi.object({
  paidBy: Joi.object({
    empId: Joi.string().required(),
    name: Joi.string().required()
  })
})

export const recoverCashAdvance = async (req, res, next) => {
  const [params, body] = await Promise.all([
    recoverSchema.validateAsync(req.params),
    recoverBodySchema.validateAsync(req.body)
  ])
  const { tenantId, travelRequestId, cashAdvanceId } = params;
  const { recoveredBy } = body;

  console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
  console.log("Received Body Data:", { recoveredBy });


  try {
    // Find and update the cash advance
    const updatedTravelRequest = await Finance.findOneAndUpdate(
      {
        tenantId,
        travelRequestId,
        'cashAdvanceSchema.cashAdvancesData': {
          $elemMatch: {
            cashAdvanceId,
            cashAdvanceStatus: status.PAID_AND_CANCELLED,
            recoveryFlag: false
          }
        }
      },
      {
        $set: {
          'cashAdvanceSchema.cashAdvancesData.$[elem].recoveredBy': recoveredBy,
          'cashAdvanceSchema.cashAdvancesData.$[elem].recoveryFlag': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': status.RECOVERED
        }
      },
      {
        arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
        new: true,
        runValidators: true,
        projection: { 'cashAdvanceSchema.cashAdvancesData.$': 1 } // Project only updated cash advance
      }
    );

    if (!updatedTravelRequest) {
      return res.status(404).json({ message: 'No matching travel request found or update failed' });
    }

    console.log("Update successful:", updatedTravelRequest);
    return res.status(200).json({ message: 'Update successful', result: updatedTravelRequest });
  } catch (error) {
    console.error('Error updating cash advance status:', error);
    next(error); // Pass the error to the error handling middleware
  }
};








