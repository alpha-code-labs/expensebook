import express from 'express';
import mongoose from 'mongoose';
import hrMaster from '../models/hrMaster.js'; // Adjust the import path as needed

const router = express.Router();

// Create a route for storing data
router.post('/create-company', async (req, res) => {
  try {

    const companyData = req.body;

    // Create a new hrMaster instance using the model
    const newCompany = new hrMaster(companyData);

    // Save the new company data to the database
    const savedCompany = await newCompany.save();
    res.status(201).json({ status: true, data: savedCompany, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error during company creation:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

export default router;
