import TenanatModel from '../models/employee_login.js'; 
import express from 'express';  
import { Router } from 'express'; 
import mongoose from 'mongoose';  
import axios from 'axios'; 
import bcrypt from 'bcrypt';
import dotenv from "dotenv";


dotenv.config();


//try for free user signup
const ONBOARDING_API = process.env.ONBOARDING_API
const saltRounds = 5;
const router = Router();
router.use(express.json());
console.log('hello expense',process.env.ONBOARDING_API)

router.post('/signup', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }
    const { companyName, fullName, email, password, mobileNumber, confirmPassword, companyHQ } = req.body;

    if (!companyName || !fullName || !email || !password || !confirmPassword || !companyHQ || !mobileNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate individual fields
    const keys = Object.keys(req.body);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!req.body[key]) {
        return res.status(400).json({ message: `${key} is missing value` });
      }
    }

    // Validate email
    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email id' });

    // Validate mobile number
    if (isNaN(mobileNumber)) return res.status(400).json({ message: 'Invalid mobile number' });

    // Validate password
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

// Check if email already in use within the same tenant
const existingEmail = await TenanatModel.findOne({
    'employees.email': email,
  });
  
  if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
    
  
    console.log(ONBOARDING_API, 'onbaording api...')
    // Send data to onboarding ms to form a tenant
    const onboarding_res = await axios.post(ONBOARDING_API, { ...req.body, email: email.toLowerCase() });

    if (onboarding_res.status !== 201) {
        return res.status(500).json({ message: 'Could not create tenant at the moment. Please try again later' });
    }

    const tenantId = onboarding_res.data.tenantId;
    console.log(tenantId)
    const otpSentTime = new Date();
    // const tenantId = "tenant22";
    const otp = 555555;

    // Create a hashed password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new tenant instance
    const newTenant = new TenanatModel({
      tenantId,
      companyName,
      companyHQ,
      onboardingFlag:false,
      employees: [
        {
          employeeDetails: {
            empId: 'empId001', // You might want to generate a unique employeeId
            name: fullName,
          },
          email,
          password: hashedPassword,
          temporaryPasswordFlag:false,
          verified: false,
          superAdmin:true,
          "employeeRoles": {
            "employee": true,
            "employeeManager": false,
            "finance": false,
            "travelAdmin": false,
            "superAdmin": true
          },
          otp,
          otpSentTime,
        },
      ],
    });

    // Save the tenant to the database
    await newTenant.save();

    // Return a success response
    return res.status(200).json({ message: 'Tenant created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default router;

