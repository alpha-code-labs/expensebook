import Finance from "../models/Finance.js";

export const getPaidAndCancelledCash = async(req , res)=>{
    try { 
      const { tenantId} = req.params;

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
        return res.status(200).json({ success:true,message: `All are settled` });
      } else {
        return res.status(200).json(singleCashAdvanceData);
      }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getCashAdvanceToSettle = async(req,res) => {
  try{
    const {tenantId} = req.params
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
      return res.status(201).json({message:"All are settled", success: true})
    }else{
      return res.status(200).json(getAllCashToSettle)
    }

  } catch(error){
    res.status(500).json(error);
  }
}


//All Cash advances with status as pending settlement. All cash advances as status Paid and Cancelled. 
export const settlement = async (req, res) => {
  const { tenantId, travelRequestId, cashAdvanceId } = req.params;
  const { paidBy } = req.body;

  if (!tenantId || !travelRequestId || !cashAdvanceId || !paidBy) {
    return res.status(400).json({ message: 'Missing field' });
  }

  console.log(`Received Parameters: ${tenantId}, ${travelRequestId}, ${cashAdvanceId}`);
  console.log(`Received Body Data: ${paidBy}`);

  const status = {
    PENDING_SETTLEMENT :'pending settlement',
    AWAITING_PENDING_SETTLEMENT:'awaiting pending settlement'
  }

  const Status = {
    PENDING_SETTLEMENT: 'pending settlement',
    AWAITING_PENDING_SETTLEMENT: 'awaiting pending settlement',
    PAID_AND_CANCELLED: 'paid and cancelled',
    PAID: 'paid',
    RECOVERED: 'recovered'
  };

  const cashStatus = Object.values(Status)

  try {
    const filter = {
      tenantId,
      travelRequestId,
      'cashAdvanceSchema.cashAdvancesData':{
        $elemMatch:{
          cashAdvanceId,
          cashAdvanceStatus:{$in:cashStatus},
          actionedUpon:false
        }
      } 
    };

    const cashAdvance = await Finance.findOne(filter);

    if (!cashAdvance) {
      return res.status(404).json({ message: 'Error, not found' });
    }


    let newStatus;
    if ([Status.PENDING_SETTLEMENT, Status.AWAITING_PENDING_SETTLEMENT].includes(cashAdvance.cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus)) {
      newStatus = Status.PAID;
    } else if (cashAdvance.cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus === Status.PAID_AND_CANCELLED) {
      newStatus = Status.RECOVERED;
    }

    const updateFields = {
      'cashAdvanceSchema.cashAdvancesData.$.settlementFlag': true,
      'cashAdvanceSchema.cashAdvancesData.$.paidBy': paidBy,
      'cashAdvanceSchema.cashAdvancesData.$.actionedUpon': true,
      'cashAdvanceSchema.cashAdvancesData.$.actionedUponDate': new Date(),
    };

    if (newStatus) {
      updateFields.cashAdvanceStatus = newStatus;
    }

    const cashAdvanceSettlement = await Finance.findOneAndUpdate(filter, { $set: updateFields }, { new: true });

    if (!cashAdvanceSettlement) {
      return res.status(404).json({ message: 'No matching document found for update' });
    }

    return res.status(200).json({ message: 'Update successful', result: cashAdvanceSettlement });
  } catch (error) {
    console.error('Error updating cashAdvance status:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


//export  const settlement = async(req , res)=>{
//     const {tenantId , travelRequestId, cashAdvanceId} = req.params;
//     console.log("LINE AT 17" , tenantId , travelRequestId ,cashAdvanceId );
//     const {cashSetteledBy} = req.body
//     console.log("LINE AT 17" , cashSetteledBy);

//     try {
//     const cashAdvanceSettlement = await Finance.updateOne({
//           tenantId,
//           travelRequestId,
//           'cashAdvanceSchema.cashAdvancesData.cashAdvanceId':cashAdvanceId,
//           },{
//             $set: {
//               'cashAdvanceSchema.cashAdvancesData':{
//                 $elemMatch: {
//                   settlementFlag: true,
//                   settlementBy: cashSetteledBy,
//                   actionedUpon: true,
//                   actionedUponDate: new Date(),
//                   cashAdvanceStatus: {
//                     $cond: {
//                       if: {
//                         $or: [
//                           { $eq: ['$cashAdvanceStatus', 'pending settlement'] },
//                           { $eq: ['$cashAdvanceStatus', 'awaiting pending settlement'] }
//                         ]
//                       },
//                       then: 'paid',
//                       else: {
//                         $cond: {
//                           if: { $eq: ['$cashAdvanceStatus', 'paid and cancelled'] },
//                           then: 'recovered',
//                           else: '$cashAdvanceStatus'
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//          , // Update only the cashAdvanceStatus field
//         {new: true } 
//       );
  
//       if (!cashAdvanceSettlement) {
//         return res.status(404).json({ message: `Error Occured` });
//       } else{
//         return res.status(200).json(cashAdvanceSettlement);
//       }
//     } catch (error) {
//       console.log("LINE AT 30" , error.message);
//       res.status(500).json(error);
//     }
// };


export const unSettlement = async(req , res)=>{
  console.log("LINE AT 37" , req.body);
    const {tenantId , travelRequestId} = req.params;
    const id = req.body._id;
    console.log("LINE AT 39" , id);

    try {
    const singleCashAdvanceUpdateAgain = await CashAdvance.findOneAndUpdate({
      tenantId,
      travelRequestId,
      },{
        $set: {
          settlementFlag: false
        }} , // Update only the cashAdvanceStatus field
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






