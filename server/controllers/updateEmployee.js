import TenanatModel from '../models/employee_login.js'; 
import express from 'express';  
import { Router } from 'express'; 


//try for free user signup
const ONBOARDING_API = 'http://localhost:8001/api/internal/create-tenant';
const saltRounds = 5;
const router = Router();
router.use(express.json());




router.post('/internal/:tenantId/updateEmployees', async (req, res) => {

  try {
    // Extract the data from the request body
    const { employees } = req.body;
    const { tenantId } = req.params;


    // const existingEmails = await TenanatModel.findOne({ 'employees.email': { $in: employees.map(emp => emp.email) } });
    // if (existingEmails) {
    //   const duplicateEmails = existingEmails.employees.map(emp => emp.email);
    //   return res.status(400).json({ error: 'One or more emails already exist', duplicateEmails });
    // }
    const updatedEmployees = employees.map(employee => ({
      ...employee,
      newFlag: true // Add the new field 'newFlag' with value 'true'
    }));

    // Proceed with updating the tenant if no emails already exist
    // Find the tenant by tenantId and update the employees array
    const updatedTenant = await TenanatModel.findOneAndUpdate(
      { tenantId },
      { employees: updatedEmployees },
      { new: true }
    );

  


    if (!updatedTenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

   
    return res.json({ message: 'Employees updated successfully', tenant: updatedTenant, duplicateEmails: [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
});

export default router

