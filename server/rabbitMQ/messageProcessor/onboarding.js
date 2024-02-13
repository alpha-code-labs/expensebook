import HRMaster from "../../models/hrMaster.js";

export default async function updateHRMaster(payload){
    try{
        const tenantId = payload.tenantId
        const result = await HRMaster.updateOne({tenantId}, {...payload}, {upsert:true})
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}