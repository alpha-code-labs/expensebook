import Joi from "joi";
import Finance from "../models/Finance.js";
import { handleErrors } from "../errorHandler/errorHandler.js"; 
import { sendToOtherMicroservice } from "../rabbitmq/publisher.js";
import HRMaster from "../models/hrMaster.js";

const getMultiCurrencyTable = async(tenantId) => {
  try{
    const getData = await HRMaster.findOne({
      tenantId,
    },{multiCurrencyTable:1})
    if (!getData) {
      throw new Error('No data found for the given tenantId');
    }

    const { exchangeValue } = getData.multiCurrencyTable
    const shortNames = Array.isArray(exchangeValue) ? exchangeValue.map(item => item.currency.shortName).filter(Boolean) : []

    return shortNames
  } catch(e){
    console.log(e);
    throw e
  }
}





export const getPaidAndCancelledCash = async(tenantId, empId)=>{
    try { 

      const cashStatus ={
        PAID_AND_CANCELLED :'paid and cancelled' 
      }

      const filterStatus = [
        status.PAID_AND_CANCELLED,
      ]
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
      const travelRequestData = report?.cashAdvanceSchema.travelRequestData;

const { tripName, travelRequestId, travelRequestNumber, createdBy } = travelRequestData || {};

          const cashAdvance = report.cashAdvanceSchema.cashAdvancesData
            .filter(cash => filterStatus.includes(cash.cashAdvanceStatus) )
            .map(({ cashAdvanceId,cashAdvanceNumber, cashAdvanceStatus, amountDetails, recoveredBy, paidBy, actionedUpon }) => ({
              actionedUpon,
              travelRequestId,
              cashAdvanceNumber,
              cashAdvanceId,
              createdBy,
              cashAdvanceStatus,
              amountDetails,
              recoveredBy,
              paidBy
            }));
          return {tripName,travelRequestId,travelRequestNumber,createdBy,cashAdvance}
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

      const shortNames = await getMultiCurrencyTable(tenantId)
console.info(shortNames)
      const settleCash = getAllCashToSettle.flatMap((report) => {
          if (!report.cashAdvanceSchema || !Array.isArray(report.cashAdvanceSchema.cashAdvancesData)) {
            return [];
          }
          const {tripName,travelRequestId,travelRequestNumber,createdBy} = report?.cashAdvanceSchema.travelRequestData
          const cashAdvance = report.cashAdvanceSchema.cashAdvancesData
            .filter(cash => filterStatus.includes(cash.cashAdvanceStatus) )
            .map(({ cashAdvanceId,cashAdvanceNumber, cashAdvanceStatus, amountDetails, recoveredBy, paidBy, actionedUpon }) => ({
              actionedUpon,
              travelRequestId,
              cashAdvanceNumber,
              cashAdvanceId,
              createdBy,
              cashAdvanceStatus,
              amountDetails,
              recoveredBy,
              paidBy
            }));
           return {tripName,travelRequestId,travelRequestNumber,createdBy,cashAdvance}
          });
          console.log("settleCash", JSON.stringify(settleCash,'',2))
        
      // const kaboom = settleCash.map(cash =>{
      //   const { cashAdvance} = cash
      //   cashAdvance.map(advance => {
      //     const isAmountDetails = advance.amountDetails
      //     let isValidCurrency
      //     isAmountDetails.forEach(amount => {
      //       if(shortNames.includes(amount.currency.shortName)){
      //         isValidCurrency = true
      //         advance.amountDetails.isValidCurrency = isValidCurrency
      //       }
      //     })
      //   })
      // })
      
      const updatedSettleCash = settleCash.map(trip => {
        return {
          ...trip,
          cashAdvance: trip.cashAdvance.map(advance => {
            return {
              ...advance,
              amountDetails: advance.amountDetails.map(detail => {
                // Return a new object with the desired properties
                return {
                  amount: detail.amount,
                  currency: detail.currency,
                  mode: detail.mode,
                  _id: detail._id,
                  isMultiCurrency: shortNames.includes(detail.currency.shortName)
                };
              })
            };
          })
        };
      });
      
      console.log(JSON.stringify(updatedSettleCash, null, 2));
      
      console.log(JSON.stringify(updatedSettleCash, null, 2));
      
        return updatedSettleCash;
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
  travelRequestId:Joi.string().required(),
  cashAdvanceId: Joi.string().required(),
})

const documentStatusEnums = ['paid', 'recovered'];

export const financeSchema = Joi.object({
  getFinance: Joi.object({
    empId: Joi.string().required(),
    name: Joi.string().required(),
  }),
  settlementDetails: Joi.array().items(
    Joi.object({
      url: Joi.string().optional(),
      comment: Joi.string().optional(), 
      status: Joi.string().valid(...documentStatusEnums).optional(),
    })
  ).min(1)
});


export const sendUpdate = async(payload,options) => {
  try{
    const {action,comments, includeTrip=false,includeCash=false, includeNonTravel=false} = options
    const services = ['dashboard','reporting']

    if(includeTrip){
      services.push('trip','expense')
    }

    if(includeCash){
      services.push('cash')
    }

    if(includeNonTravel){
      services.push('expense')
    }

    console.log("non travel - services", services)

    console.log("payload sent for other ms ....",payload)
    const results = await Promise.allSettled([
      services.map(service => sendToOtherMicroservice(payload,action,service,comments))
    ])
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
          console.log(`Service ${index + 1} succeeded with:`, result.value);
      } else {
          console.error(`Service ${index + 1} failed with reason:`, result.reason);
      }
  });
  } catch(error){
    console.error(error)
    throw new Error(error.message)
  }
}

export const paidCashAdvance = async (req, res, next) => {
try {
  const [params,body]=await Promise.all([
    cashSchema.validateAsync(req.params),
    financeSchema.validateAsync(req.body)
  ])

  const { tenantId, travelRequestId, cashAdvanceId } = params;
  const { getFinance, settlementDetails } = body;

  let setSettlementDetails

  if (Array.isArray(settlementDetails) && settlementDetails.length > 0) {
setSettlementDetails = settlementDetails.map(details => ({
  ...details,
  status: 'paid',
}));
  }

  console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
  console.log("Received Body Data: kaboom", JSON.stringify(req.body,'',2));

  const STATUS = {
    PENDING_SETTLEMENT: 'pending settlement',
    PAID: 'paid'
  };
    const updateResult = await Finance.findOneAndUpdate(
      {
        tenantId,
        travelRequestId,
        'cashAdvanceSchema.cashAdvancesData': {
          $elemMatch: {
            cashAdvanceId,
            cashAdvanceStatus: STATUS.PENDING_SETTLEMENT,
            // paidFlag: false
          }
        }
      },
      {
        $set: {
          'cashAdvanceSchema.cashAdvancesData.$[elem].paidBy': getFinance,
          'cashAdvanceSchema.cashAdvancesData.$[elem].paidFlag': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': STATUS.PAID,
          'cashAdvanceSchema.cashAdvancesData.$[elem].actionedUpon': true,
        },
        $push:{
          'cashAdvanceSchema.cashAdvancesData.$[elem].settlementDetails':setSettlementDetails,
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

    const { travelRequestStatus} = updateResult.cashAdvanceSchema.travelRequestData

    let includeTrip = false
    if(travelRequestStatus =='booked'){
      includeTrip = true
    }

    const payload = {
      tenantId, travelRequestId, cashAdvanceId,paidBy:getFinance,paidFlag:true,cashAdvanceStatus:STATUS.PAID, settlementDetails:setSettlementDetails
    }

    console.log("Update successful:paidCashAdvance-", updateResult);

    // const { travelRequestData:{travelRequestStatus}} = updateResult?.cashAdvanceSchema

    const options = {
    action :'settle-ca',
    comments:'cash advance paid by finance',
    includeCash:'true',
    includeTrip
    }

    await sendUpdate(payload,options)
    return res.status(200).json({ message: 'cash Advance paid Successfully'});
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

export const recoverCashAdvance = async (req, res, next) => {
  try {
    const [params, body] = await Promise.all([
      recoverSchema.validateAsync(req.params),
      financeSchema.validateAsync(req.body)
    ])
    const { tenantId, travelRequestId, cashAdvanceId } = params;
    const { getFinance,settlementDetails } = body;
    let setSettlementDetails

    if (Array.isArray(settlementDetails) && settlementDetails.length > 0) {
  setSettlementDetails = settlementDetails.map(details => ({
    ...details,
    status: 'recovered',
  }));
    }
  
    console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
    console.log("Received Body Data:", { getFinance });
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
          'cashAdvanceSchema.cashAdvancesData.$[elem].recoveredBy': getFinance,
          'cashAdvanceSchema.cashAdvancesData.$[elem].recoveryFlag': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': status.RECOVERED
        },
        $push:{
          'cashAdvanceSchema.cashAdvancesData.$[elem].settlementDetails':setSettlementDetails,
        }
      },
      {
        arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
        new: true,
      }
    );

    if (!updatedTravelRequest) {
      return res.status(404).json({ message: 'No matching travel request found or update failed' });
    }

    const { travelRequestStatus } = updatedTravelRequest.cashAdvanceSchema.travelRequestData

    let includeTrip = false
    if(travelRequestStatus =='booked'){
      includeTrip = true
    }
    console.log("Update successful:", updatedTravelRequest);

    const payload = {
      tenantId, travelRequestId, cashAdvanceId,recoveredBy:getFinance,recoveryFlag, cashAdvanceStatus: status.RECOVERED,
      settlementDetails:setSettlementDetails
    }
    console.log("Update successful:recoverCashAdvance:", payload);

    const options = {
      action :"recover-ca",
      comments:'cash advance recovered by finance',
      includeCash:'true',
      includeTrip,
      }

    await sendUpdate(payload,options)
    return res.status(200).json({ message: 'Recovery successful'});
  } catch (error) {
    console.error('Error updating cash advance status:', error);
    next(error); // Pass the error to the error handling middleware
  }
};









