import HRCompany from "../models/hrCompanySchema.js";

const getEmployeeDetails = async(tenantId,empId) => {
    try{
        const employeeDocument = await HRCompany.findOne({
            tenantId,
            'employees.employeeDetails.employeeId': empId
          });
      
          if (!employeeDocument) {
            console.warn(`Employee not found for tenantId: ${tenantId}, empId: ${empId}`);
            return { success: false, message: 'Invalid credentials. Please check your employee ID.' };
        }

        const {groups} = employeeDocument
        const getAllGroups = groups.map(group => group.groupName)
          const getEmployee = employeeDocument?.employees.find(e => e.employeeDetails.employeeId.toString() === empId.toString())
          const {employeeDetails:getEmployeeDetails ,group } = getEmployee
          const { employeeName, employeeId , department, designation,grade,project} = getEmployeeDetails
          console.log("employee name man", employeeName, employeeId )
          const employeeDetails = { employeeName, employeeId , department, designation,grade,project}
          return {employeeDocument,employeeDetails,group , getAllGroups}
    } catch(error){
        console.log(error);
    }
}

const getGroupDetails = async(tenantId,empId, getGroups) => {
    try{
        let matchedEmployees
        const employeeDocument = await HRCompany.findOne({
            tenantId,
            'employees.employeeDetails.employeeId': empId
        });
    
        if (!employeeDocument) {
            console.warn(`Employee not found for tenantId: ${tenantId}, empId: ${empId}`);
            return { success: false, message: 'Invalid credentials. Please check your employee ID.' };
        }

        const {groups} = employeeDocument
        const getAllGroups = groups.map(group => group.groupName)
        const getEmployee = employeeDocument?.employees.find(e => e.employeeDetails.employeeId.toString() === empId.toString())

        if(getGroups){
            const upperCaseGroups = getGroups.map(group => group.replace(/\s+/g, '').toUpperCase());
            
        
            matchedEmployees = employeeDocument?.employees
                .filter(employee => 
                    employee.group.some(empGroup => 
                        upperCaseGroups.includes(empGroup.replace(/\s+/g, '').toUpperCase())
                    )
                )
                .map(employee => ({
                    empId: employee.employeeDetails.employeeId,
                    empName: employee.employeeDetails.employeeName
                }));
                if(!matchedEmployees?.length){
                    console.log("No employee found in the group");
                    throw new Error(`No employee found for the group:- ${getGroups}`)
                }
        }

        const {employeeDetails:getEmployeeDetails ,group } = getEmployee
        const { employeeName, employeeId , department, designation,grade,project} = getEmployeeDetails
        console.log("employee name man", employeeName, employeeId )
        const employeeDetails = { employeeName, employeeId , department, designation,grade,project}
        return {employeeDocument,employeeDetails,group , getAllGroups, matchedEmployees}
    } catch(e){
        console.log(e);
        throw e
    }
}

export{
    getEmployeeDetails,
    getGroupDetails
}



