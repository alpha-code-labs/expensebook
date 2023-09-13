import express from 'express'


import HRCompany from '../model/hr_company_srtucture.js'

const router = express.Router();

router.post('/hrcompanies', async (req, res) => {
  try {
    // Create a new HRCompany document with data from the request body
    const newHRCompany = new HRCompany(req.body);

    // Save the new HRCompany document to the database
    const savedHRCompany = await newHRCompany.save();

    res.status(201).json(savedHRCompany); // Respond with the saved HRCompany data
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
