import express from 'express';
import TenantModel from '../models/employee_login.js';

const router = express.Router();

// Route to get all company names in an array
router.get('/companyNames', async (req, res) => {
  try {
    // Fetch all tenants from the database
    const tenants = await TenantModel.find({}, 'companyName');

    // Extract company names from the result
    const companyNames = tenants.map((tenant) => tenant.companyName);

    return res.status(200).json({ companyNames });
  } catch (error) {
    console.error('Error fetching company names:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




export default router;
