import HRMaster from "../../models/hrMaster.js"

export async function updatePreferences(payload /* */){
    try{
        const {tenantId, employeeId, travelPreferences} = payload
        
        const tenant = HRMaster.findOne({tenantId})
        if(!tenant) return {success: false, error: 'Tenant not found'}
        let employeeData = tenant.employees.filter(emp=> emp.employeeId == employeeId)

        if(employeeData.length > 0){
            employeeData = employeeData[0]
            employeeData.travelPreferences = travelPreferences
            tenant.save()
            return {success:true, error:null}
        }

        return {success:false, error: 'Employee not found'}

    }catch(e){
        return {success:false, error:e}
    }
}

