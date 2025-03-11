import express from 'express';
import TenantModel from '../models/employee_login.js';

const router = express.Router();


router.get('/internal/:tenantId/:employeeId/roles', async (req, res) => {

    try {
      const tenantId = req.params.tenantId;
      const employeeId = req.params.employeeId;
      const tenant = await TenantModel.findOne({ tenantId });
      
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }
  
      const employee = tenant.employees.find(emp => emp.employeeDetails.empId === employeeId);
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
  
      const employeeRoles = employee.employeeRoles;
      const employeeDetails = employee.employeeDetails;
      const email = employee.email
      const tenantName = tenant.companyName

      const employeeInfo = {employeeDetails,email, tenantName }

      
      res.status(200).json({ employeeRoles,employeeInfo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

 export default router 