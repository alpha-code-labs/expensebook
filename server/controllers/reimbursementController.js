import Joi from "joi";
import { Approval } from "../models/approvalSchema.js";

const otherExpenseSchema = Joi.object({
    tenantId:Joi.string().required(),
    empId: Joi.string().required(),
    expenseHeaderId: Joi.string().required(),
  })
  
async function getNonTravelExpenseReport(tenantId, empId, expenseHeaderId) {
    try {
      const report = await Approval.findOne({
        tenantId,
        'reimbursementSchema.expenseHeaderId':expenseHeaderId,
        'reimbursementSchema.approvers': {
              $elemMatch: {
                'empId': empId,
                status:'pending approval'
              }
            }
      });
  
      if (report) {
        console.log("Retrieved report:", report);
        return report;
      } else {
        throw new Error("Report not found for the specified criteria."); 
      }
    } catch (error) {
      console.error("Error occurred while fetching the report:", error); 
      throw new Error(`Failed to retrieve the non-travel expense report: ${error.message}`); 
    }
  }


  export const nonTravelReportApproval = async (req, res) => {
  try {
    const { error: errorParams, value: valueParams} = otherExpenseSchema.validate(req.params)

    if(errorParams){
      return res.status(400).json({error: `Invalid Parameters ${errorParams.details[0].message}`})
    }
     const { tenantId, expenseHeaderId, empId } = valueParams;

     const getReport = await getNonTravelExpenseReport(tenantId, empId, expenseHeaderId)

     if(!getReport){
        return res.status(404).json({success: false, error: "Report not found for the specified criteria."})
     }

     return res.status(200).json({success: true , getReport})
} catch(error){
    console.error("Error occurred while fetching the report:", error);
    return res.status(500).json({error: `Failed to retrieve the non-travel expense`})
}
}