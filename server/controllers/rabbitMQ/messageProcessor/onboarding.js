import HRMaster from "../../../models/hrMaster.js";
import EmpolyeeCredential from "../../../models/employeeCredential.js";
import TenanatModel from "../../../models/employee_login.js";

export  async function updateHRMaster(payload){
    try{
        const tenantId = payload.tenantId
        const result = await HRMaster.updateOne({tenantId}, {...payload}, {upsert:true})
        return {success:true, error:null}
    }catch(e){
        return {success:false, error:e}
    }
}

// export async function updateEmployee(payload) {
//   try {
//     console.log('payload for login ', payload);
//     // Extract the data from the request body
//     const employees = payload.employeeData;
//     const tenantId = payload.tenantId;

//     // Map employees to set temporaryPasswordFlag, verified, etc.
//     const updatedEmployees = employees.map(employee => ({
//       ...employee,
//       password: "",
//       temporaryPasswordFlag: false,
//       verified: false,
//     }));

//     // Find the tenant by tenantId
//     const existingTenant = await TenanatModel.findOne({ tenantId });

//     if (!existingTenant) {
//       return { success: false, error: 'No tenant found for provided id.' };
//     }

//     // Filter out employees whose emails already exist in the database
//     const nonExistingEmployees = updatedEmployees.filter(updatedEmployee => {
//       return !existingTenant.employees.some(existingEmployee =>
//         existingEmployee.email === updatedEmployee.email
//       );
//     });

//     // Update the tenant with employees whose emails do not exist in the database
//     const updatedTenant = await TenanatModel.findOneAndUpdate(
//       { tenantId },
//       { $push: { employees: { $each: nonExistingEmployees } }, onboardingFlag: true },
//       { new: true }
//     );

//     if (!updatedTenant) {
//       return { success: false, error: 'Failed to update tenant.' };
//     }

//     return { success: true, error: null };
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: 'Something went wrong' };
//   }
// }

 export async function updateEmployee(payload){

  try {
    console.log('payload for login ',payload)
    // Extract the data from the request body
    const employees= payload.employeeData;
    const tenantId = payload.tenantId;


    // const existingEmails = await TenanatModel.findOne({ 'employees.email': { $in: employees.map(emp => emp.email) } });
    // if (existingEmails) {
    //   const duplicateEmails = existingEmails.employees.map(emp => emp.email);
    //   return res.status(400).json({ error: 'One or more emails already exist', duplicateEmails });
    // }
    console.log('employees11',employees)
    const updatedEmployees = employees.map(employee => ({
      ...employee,
      password: "",
      temporaryPasswordFlag:false,
      verified:false,
    }));

    // Proceed with updating the tenant if no emails already exist
    // Find the tenant by tenantId and update the employees array
    const updatedTenant = await TenanatModel.findOneAndUpdate(
      { tenantId },
      { employees: updatedEmployees,onboardingFlag:true},
      { new: true }
    );

    // const updatedTenant = await TenanatModel.findOneAndUpdate(
    //   { tenantId },
    //   { employees },
    //   { new: true }
    // );

    


    if (!updatedTenant) {
      return {success: false, error:'No tenant found for provided id.'};
    }

   
    return {success: true, error:null};
  } catch (error) {
    console.error(error);
    return {success: false, error:'Something went wrong'};
  }
}