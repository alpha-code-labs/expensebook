import HRMaster from "../../models/hrMasterSchema.js";

export const updateHRMaster = async (payload) => {
      try {
      const updated = await HRMaster.findOneAndUpdate(
        { 'tenantId': payload.tenantId},
        {
         payload,
        },
        { upsert: true, new: true }
      );
      console.log('Saved to HrMaster: using async queue', updated);
      return { success: true, error: null}
    } catch (error) {
      console.error('Failed to update HrMaster: using synchronous queue', error);
      return { success: false, error: error}
    }
}

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

