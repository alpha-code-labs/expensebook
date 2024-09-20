import HRCompany from "../models/hrCompanySchema.js";

const getEmployeeDetails = async(tenantId,empId) => {
    try{
        const employeeDocument = await HRCompany.findOne({
            tenantId,
            'employees.employeeDetails.employeeId': empId
          });
      
          if (!employeeDocument) {
            return res.status(404).json({
              success: false,
              message: 'Employee not found for the given IDs',
            });
          }
    
          const getEmployee = employeeDocument?.employees.find(e => e.employeeDetails.employeeId.toString() === empId.toString())
          const { employeeName, employeeId , department, designation,grade,project} = getEmployee.employeeDetails
          console.log("employee name man", employeeName, employeeId )
          const employeeDetails = { employeeName, employeeId , department, designation,grade,project}
          return {employeeDocument,employeeDetails}
    } catch(error){
        console.log(error);
    }
}


export{
    getEmployeeDetails
}