import TenanatModel from "../models/employee_login.js";
import express from "express"
import { Router } from "express";
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login',async(req,res)=>{
    
    
    try{
        if(!req.body){
            return res.status(400).json({ message: 'Request body is missing' })
        }
        const {companyName,email,password}=req.body
        if(!companyName || !email || !password ){
            return res.status(400).json({message:'Missing required fields'})
        }
        
        const keys = Object.keys(req.body)

        for(let i = 0 ; i < keys.length ; i++){
            const key = keys[i]
            if(!req.body[key]){
                return res.status(401).json({message:`${key} is missing value`})
            }
        }

        if(!validateEmail(email)) return res.status(401).json({message:'Invalid mobile number'})


        

        
        const user = await TenanatModel.findOne({'companyName': companyName ,'employees.email':email})
        

        if(!user) return res.status(401).json({message:'email is not registered with selected company'})

        const employee = user.employees.find((emp)=>emp.email === email)


        const validPassword = await bcrypt.compare(password, user.employees[0].password);
        const temporaryPasswordFlag = user.employees[0].temporaryPasswordFlag
        const onboardingFlag = user.onboardingFlag;

        if(!validPassword) return res.status(401).json({message:"Invalid email or password"})

        const  token = employee.generateAuthToken();
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          });
        
       res.status(200).json({data:token,temporaryPasswordFlag,onboardingFlag,empId: employee.employeeDetails.empId,
        tenantId: user.tenantId, message: 'Login successful'});
       
       
    }catch(error){
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

})


const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

export default router