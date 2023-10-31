import express from 'express'
import { createAccountlineWithTenantId } from '../model/account_line.js'

const router = express.Router();

// route for creating an account line document
router.post('/create_accountline', async (req, res) => {
  try {
    // Get the tenantId and accountLineData from the request body
    const { tenantId, accountLineData } = req.body

    // Call the createAccountlineWithTenantId function to create the account line
    const createdAccountLine = await createAccountlineWithTenantId(tenantId, accountLineData);

    res.status(201).json(createdAccountLine);
  } catch (error) {
    console.error('Error creating account line:', error);
    res.status(500).json({ error: 'An error occurred while creating the account line.' });
  }
})



export default router;
