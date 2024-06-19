import Finance from "../models/Finance.js";

 const getCashAdvanceData = async(req , res)=>{
    try { 
      const { tenantId} = req.params;

      const singleCashAdvanceData = await Finance.find({
        'cashAdvanceSchema.cashAdvancesData.actionedUpon': false,
        'cashAdvanceSchema.cashAdvancesData.tenantId':tenantId,
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





const settlement = async (req, res) => {
  const { tenantId, travelRequestId, cashAdvanceId } = req.params;
  const { settlementBy } = req.body;

  if (!tenantId || !travelRequestId || !cashAdvanceId || !settlementBy) {
    return res.status(400).json({ message: 'Missing required parameters or body fields' });
  }

  console.log("Received Parameters:", tenantId, travelRequestId, cashAdvanceId);
  console.log("Received Body Data:", settlementBy);

  try {
    const filter = {
      tenantId,
      travelRequestId,
      'cashAdvanceSchema.cashAdvancesData.cashAdvanceId': cashAdvanceId
    };

    const cashAdvance = await Finance.findOne(filter);

    if (!cashAdvance) {
      return res.status(404).json({ message: 'Error, not found' });
    }

    let newStatus;
    if (['pending settlement', 'awaiting pending settlement'].includes(cashAdvance.cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus)) {
      newStatus = 'paid';
    } else if (cashAdvance.cashAdvanceSchema.cashAdvancesData.cashAdvanceStatus === 'paid and cancelled') {
      newStatus = 'recovered';
    }

    const updateFields = {
      'cashAdvanceSchema.cashAdvancesData.$.settlementFlag': true,
      'cashAdvanceSchema.cashAdvancesData.$.settlementBy': settlementBy,
      'cashAdvanceSchema.cashAdvancesData.$.actionedUpon': true,
      'cashAdvanceSchema.cashAdvancesData.$.actionedUponDate': new Date(),
    };

    if (newStatus) {
      updateFields.cashAdvanceStatus = newStatus;
    }

    const cashAdvanceSettlement = await Finance.updateOne(filter, { $set: updateFields }, { upsert: true, new: true });

    if (cashAdvanceSettlement.matchedCount === 0) {
      return res.status(404).json({ message: 'No matching document found for update' });
    }

    if (cashAdvanceSettlement.modifiedCount === 0) {
      return res.status(200).json({ message: 'No fields were modified as the data was already up-to-date' });
    }

    return res.status(200).json({ message: 'Update successful', result: cashAdvanceSettlement });
  } catch (error) {
    console.error('Error updating cashAdvance status:', error.message);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


//  const settlement = async(req , res)=>{
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


 const unSettlement = async(req , res)=>{
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

export {getCashAdvanceData , settlement , unSettlement};





