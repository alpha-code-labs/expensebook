import TenanatModel from '../models/employee_login.js';
import express from 'express';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { generateRandomPassword } from '../utils/handyfunctions.js';


const saltRounds = 5;
const router = Router();
router.use(express.json());


// for verify otp
router.post('/forgot-password', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const {companyName, email } = req.body;

    const keys = Object.keys(req.body)

        for(let i = 0 ; i < keys.length ; i++){
            const key = keys[i]
            if(!req.body[key]){
                return res.status(400).json({message:`${key} is missing value`})
            }
        }

    if (!companyName || !email ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    // Find the user by email
    
    const user = await TenanatModel.findOne({'companyName': companyName ,'employees.email':email})

        if(!user) return res.status(401).json({message:'We are unable to find your registered email address.'})

    const employee = user.employees.find((emp)=>emp.email === email)
//generating password and send to sendgrip for later and save in password
    const password = generateRandomPassword()
    console.log(password)    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   employee.password= hashedPassword
   employee.temporaryPasswordFlag = true
   await user.save();

  return res.status(200).json({ message: 'Temporary password has been sent to registered email' });


  } catch (error) {
    console.error('Error during forgot password', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;