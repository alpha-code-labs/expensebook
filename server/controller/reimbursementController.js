import Finance from "../models/Finance.js";
 
export const getReimbursement = async(req , res)=>{
    try {
      const {tenantId}= req.params
      console.log("tenantId", req.params.tenantId)

        const singleReimbursement = await Finance.find({
          'reimbursementSchema.tenantId': tenantId,
          'reimbursementSchema.actionedUpon': false
      });

        if(!singleReimbursement){
          return res.status(200).json({success:true, message: `All are settled` });
        } else{
          return res.status(200).json(singleReimbursement)
        }
    } catch (error) {
        res.status(500).json(error);
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



