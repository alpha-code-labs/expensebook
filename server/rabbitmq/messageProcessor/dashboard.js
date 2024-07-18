import HRCompany from "../../model/hr_company_structure.js"

export async function updatePreferences(payload /* */){
    try{
        const {tenantId, employeeId, travelPreferences, imageUrl} = payload
        
        const tenant = HRCompany.findOne({tenantId})
        if(!tenant) return {success: false, error: 'Tenant not found'}
        let employeeData = tenant.employees.filter(emp=> emp.employeeId == employeeId)

        if(employeeData.length > 0){
            employeeData = employeeData[0];
            employeeData.travelPreferences = travelPreferences;
            employeeData.imageUrl = imageUrl;
            tenant.save();
            return {success:true, error:null}
        }

        return {success:false, error: 'Employee not found'}

    }catch(e){
        return {success:false, error:e}
    }
}

