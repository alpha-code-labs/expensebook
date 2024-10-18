import TenanatModel from "../models/employee_login.js";
import express from "express";
import { Router } from "express";
import bcrypt from 'bcrypt';
import { generateJWT } from "../auth/generateToken.js";

const router = Router();

router.post('/login', async (req, res) => {
    try {
        // Check if request body is missing
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        // Destructure the request body
        const { companyName, email, password } = req.body;

        // Check for missing required fields
        if (!companyName || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(401).json({ message: 'Invalid email format' });
        }

        // Find user by companyName and email
        const user = await TenanatModel.findOne({ companyName, 'employees.email': email });

        // If user not found, return error
        if (!user) {
            return res.status(401).json({ message: 'Email is not registered with selected company' });
        }

        // Find employee by email
        const employee = user.employees.find((emp) => emp.email === email);

        // Compare password with the hashed password of the employee
        const validPassword = await bcrypt.compare(password, employee.password);

        // If password is invalid, return error
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Send success response with relevant data 
        
        const tenantId = user.tenantId
        const empId = employee.employeeDetails.empId

        const token = generateJWT(tenantId,empId)
        console.log('authToken',token)
        res.cookie('authToken',token,{
            httpOnly:true,
            secure:false,
            sameSite:"Lax", 
            maxAge:3600000 //1 hour
        })
        res.status(200).json({
            temporaryPasswordFlag: employee.temporaryPasswordFlag,
            onboardingFlag: user.onboardingFlag,
            tenantId,
            empId,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Email validation function
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export default router;
