import HRCompany from '../models/hrMaster.js'; 
import express from 'express';  
import { Router } from 'express'; 
import mongoose from 'mongoose';  
import axios from 'axios'; 
import bcrypt from 'bcrypt';

//try for free user signup
const ONBOARDING_API = 'http://localhost:8001/api/internal/create-tenant';
const saltRounds = 5;
const router = Router();
router.use(express.json());




router.post('/hrcompanies', async (req, res) => {
    try {
      const hrCompanyData = req.body; // Assuming the request body contains data for HRCompany
  
      // Create a new HRCompany 
      const hrCompany = new HRCompany(hrCompanyData);
  
      // Save the HRCompany
      await hrCompany.save();
  
      res.status(201).json({ message: 'HRCompany created successfully', data: hrCompany });
    } catch (error) {
      console.error('Error creating HRCompany:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

export default router