import Finance from "../models/Finance.js";


export const getPaidAndCancelledCash = async(tenantId, empId)=>{
    try { 

      const cashStatus ={
        PAID_AND_CANCELLED :'paid and cancelled' 
      }

      const singleCashAdvanceData = await Finance.find({
        'cashAdvanceSchema.cashAdvancesData.actionedUpon': false,
        'cashAdvanceSchema.cashAdvancesData.tenantId':tenantId,
        'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:[cashStatus.PAID_AND_CANCELLED]}
        }
      );

      if(!singleCashAdvanceData){
        return { success:true, message: `All are settled` };
      } else {
        return singleCashAdvanceData;
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
      AWAITING_PENDING_SETTLEMENT:'awaiting pending settlement'
    }

    const cashToSettle = Object.values(status)
    console.log("status", cashToSettle)

    const getAllCashToSettle = await Finance.find({
      'cashAdvanceSchema.cashAdvancesData.tenantId':tenantId,
      'cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus':{$in:cashToSettle},
      'cashAdvanceSchema.cashAdvancesData.actionedUpon':false
    })

    if(!getAllCashToSettle){
      return {message:"All are settled", success: true}
    }else{
      return  getAllCashToSettle
    }

  } catch(error){
    console.error("Error in fetching cashAdvance to settle:", error);
    throw new Error({ error: 'Error in fetching cashAdvance to settle:', error });

  }
}

//All Cash advances with status as pending settlement. 
export const paidCashAdvance = async (req, res) => {
  const { tenantId, travelRequestId, cashAdvanceId } = req.params;
  const { paidBy } = req.body;

  console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
  console.log("Received Body Data:", { paidBy });

  if (!tenantId || !travelRequestId || !cashAdvanceId || !paidBy) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  const status = {
    PENDING_SETTLEMENT:'pending settlement'
  };

  const newStatus ={
    PAID: 'paid',
  }


  try {
    const travelRequest = await Finance.findOne({
      tenantId,
      travelRequestId,
      'cashAdvanceSchema.cashAdvancesData': {
        $elemMatch: {
          cashAdvanceId,
          cashAdvanceStatus: status.PENDING_SETTLEMENT,
          actionedUpon: false
        }
      }
    });

    if (!travelRequest) {
      return res.status(404).json({ message: 'No matching document found' });
    }

    const cashAdvanceIndex = travelRequest.cashAdvanceSchema.cashAdvancesData.findIndex(
      (item) => JSON.stringify(item.cashAdvanceId) === JSON.stringify(cashAdvanceId)
    );

    if (cashAdvanceIndex === -1) {
      return res.status(404).json({ message: 'No matching cash advance found' });
    }

    const updateResult = await Finance.updateOne(
      {
        tenantId,
        travelRequestId,
        'cashAdvanceSchema.cashAdvancesData': {
          $elemMatch: {
            cashAdvanceId,
            cashAdvanceStatus: status.PENDING_SETTLEMENT,
            actionedUpon: false
          }
        }
      },
      {
        $set: {
          'cashAdvanceSchema.cashAdvancesData.$[elem].paidBy': paidBy,
          'cashAdvanceSchema.cashAdvancesData.$[elem].actionedUpon': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': newStatus.PAID
        }
      },
      {
        arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
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

// All cash advances as status Paid and Cancelled. 
export const recoverCashAdvance = async (req, res) => {
  const { tenantId, travelRequestId, cashAdvanceId } = req.params;
  const { recoveredBy } = req.body;

  console.log("Received Parameters:", { tenantId, travelRequestId, cashAdvanceId });
  console.log("Received Body Data:", { recoveredBy });

  if (!tenantId || !travelRequestId || !cashAdvanceId || !recoveredBy) {
    return res.status(400).json({ message: 'Missing required field' });
  }

  const status = {
    PAID_AND_CANCELLED: 'paid and cancelled',
    RECOVERED: 'recovered'
  };

  try {
    const travelRequest = await Finance.findOne({
      tenantId,
      travelRequestId,
      'cashAdvanceSchema.cashAdvancesData': {
        $elemMatch: {
          cashAdvanceId,
          cashAdvanceStatus: status.PAID_AND_CANCELLED,
          actionedUpon: false
        }
      }
    });

    if (!travelRequest) {
      return res.status(404).json({ message: 'No matching document found' });
    }

    const cashAdvanceIndex = travelRequest.cashAdvanceSchema.cashAdvancesData.findIndex(
      (item) => JSON.stringify(item.cashAdvanceId) === JSON.stringify(cashAdvanceId)
    );

    if (cashAdvanceIndex === -1) {
      return res.status(404).json({ message: 'No matching cash advance found' });
    }

    const updateResult = await Finance.updateOne(
      {
        tenantId,
        travelRequestId,
        'cashAdvanceSchema.cashAdvancesData': {
          $elemMatch: {
            cashAdvanceId,
            cashAdvanceStatus: status.PAID_AND_CANCELLED,
            actionedUpon: false
          }
        }
      },
      {
        $set: {
          'cashAdvanceSchema.cashAdvancesData.$[elem].recoveredBy': recoveredBy,
          'cashAdvanceSchema.cashAdvancesData.$[elem].actionedUpon': true,
          'cashAdvanceSchema.cashAdvancesData.$[elem].cashAdvanceStatus': status.RECOVERED
        }
      },
      {
        arrayFilters: [{ 'elem.cashAdvanceId': cashAdvanceId }],
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








