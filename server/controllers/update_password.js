import TenanatModel from '../models/employee_login.js';
import express from 'express';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const saltRounds = 5;
const router = Router();
router.use(express.json());

const JWT_SECRET=process.env.JWT_SECRET || 1234

// for verify otp
router.post('/set-password', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { email ,password ,confirmPassword} = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if(password != confirmPassword){
        return res.status(400).json({message:'Passwords do not match'})
    }

    // Find the user by email
    const user = await TenanatModel.findOne({ 'employees.email': email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const employee = user.employees.find((emp) => emp.email === email);

    // Check if the employee is already verified
    if (!employee.verified) {
      return res.status(400).json({ message: 'OTP is not verified' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

   employee.password= hashedPassword
   employee.temporaryPasswordFlag = false
   await user.save();

    
   const authToken = employee.generateAuthToken();
    // Send the token as a cookie to the frontend
   res.cookie('authToken', authToken, { httpOnly: true });
   

  return res.status(200).json({ message: 'Password updated successfully' ,token:authToken});

  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;