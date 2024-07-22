import HRMaster from "../models/hrCompanySchema.js"
import { fetchOnboardingData } from "../services/hrData.js"


export async function getHrData(req,res) {
    try{
 const { tenantId, empId} = req.params

    const report = await fetchOnboardingData(tenantId,empId)

    if(report){
        return res.status(200).json(report)
    }

    } catch(error){
     console.error(error)
     return res.status(500).json({message: 'internal server error'})
    }
}