import HRCompany from '../../model/hr_company_structure.js'


export default async function updateHRMaster(payload){
    try{
        const tenantId = payload.tenantId
        const result = await HRCompany.updateOne({tenantId}, {...payload}, {upsert: true})
       // console.log(payload)
        console.log(result, 'result of update operation')
        return {success:true, error:null}
    }catch(e){
        console.log(e, 'error while consuming onboarding data');
        return {success:false, error:e}
    }
}