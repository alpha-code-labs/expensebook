import TenantModel from '../models/employee_login.js';
import express from 'express';
import { Router } from 'express';
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '../utils/handyfunctions.js';
import { EmailClient } from '@azure/communication-email'; 



const saltRounds = 5;
const router = Router();
dotenv.config()
router.use(express.json());

const connectionString = process.env.EMAIL_API
const client = new EmailClient(connectionString);

async function sendEmail(toAddress, password) {
    const emailMessage = {
        senderAddress: "DoNotReply@0b92c556-0591-4ff8-bfc5-9fa5358b53c0.azurecomm.net",
        content: {
            subject: "Your Temporary Password",
            plainText: `Hello, \n\nYour temporary password is: ${password}\n\nPlease use this password to log in and reset your password immediately.`,
        },
        recipients: {
            to: [{ address: toAddress }],
        },
    };

    const poller = await client.beginSend(emailMessage);
    const response = await poller.pollUntilDone();

    if (response.status === 'Succeeded') {
        console.log("Email sent successfully!");
    } else {
        console.error("Email failed to send.");
        console.log(response);
    }
}

// For forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }

    const { companyName, email } = req.body;

    const keys = Object.keys(req.body);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!req.body[key]) {
        return res.status(400).json({ message: `${key} is missing value` });
      }
    }

    if (!companyName || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the user by email
    const user = await TenantModel.findOne({ 'companyName': companyName, 'employees.email': email });
//update with 401 status some frontend issue only with status
    if (!user) return res.status(403).json({ message: 'We are unable to find your registered email address.' });

    const employee = user.employees.find((emp) => emp.email === email);

    if(!employee.verified) return res.status(403).json({message: 'Kindly complete the OTP verification process'})
    // Generating password and send to sendgrip for later and save in password
    const password = generateRandomPassword();
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    employee.password = hashedPassword;
    employee.temporaryPasswordFlag = true;
    await user.save();
    
    // Send the email with the temporary password
    // await sendEmail(email, password);

    return res.status(200).json({ message: 'Temporary password has been sent to registered email' });

  } catch (error) {
    console.error('Error during forgot password', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

// import TenanatModel from '../models/employee_login.js';
// import express from 'express';
// import { Router } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken'
// import { generateRandomPassword } from '../utils/handyfunctions.js';


// const saltRounds = 5;
// const router = Router();
// router.use(express.json());


// // for verify otp
// router.post('/forgot-password', async (req, res) => {
//   try {
//     if (!req.body) {
//       return res.status(400).json({ message: 'Request body is missing' });
//     }

//     const {companyName, email } = req.body;

//     const keys = Object.keys(req.body)

//         for(let i = 0 ; i < keys.length ; i++){
//             const key = keys[i]
//             if(!req.body[key]){
//                 return res.status(400).json({message:`${key} is missing value`})
//             }
//         }

//     if (!companyName || !email ) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }


//     // Find the user by email
    
//     const user = await TenanatModel.findOne({'companyName': companyName ,'employees.email':email})

//         if(!user) return res.status(401).json({message:'We are unable to find your registered email address.'})

//     const employee = user.employees.find((emp)=>emp.email === email)
// //generating password and send to sendgrip for later and save in password
//     const password = generateRandomPassword()
//     console.log(password)    
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     employee.password = hashedPassword
//     employee.temporaryPasswordFlag = true
//     await user.save();

//   return res.status(200).json({ message: 'Temporary password has been sent to registered email' });


//   } catch (error) {
//     console.error('Error during forgot password', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// export default router;