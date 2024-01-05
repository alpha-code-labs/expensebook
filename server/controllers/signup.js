import User from '../models/login_logout'
import axios from 'axios'
import bcrypt from 'bcrypt'
const ONBOARDING_API = 'http://localhost:8001/api/internal/create-tenant'

const saltRounds = 5

export default async function handleSignUp(req, res){
    try{
        const {companyName, fullName, email, password, mobileNumber, confirmPassword, companyHQ} = req.body        

        if(!companyName || !fullName || !email || !password || !confirmPassword || !companyHQ || !mobileNumber){
            return res.status(400).json({message: 'Missing required fields'})
        }
        const keys = Object.keys(req.body)

        for(let i=0; i<keys.length; i++){
            const key = keys[i]
            if(req.body[key] == '' || req.body[key] == undefined || req.body[key] == null){
                return res.status(400).json({message: `${key} is missing value`})
            }
        }

        //validate email
        if(!validateEmail(email)) return res.status(400).json({message: 'Invalid email id'})

        //validate mobile number
        if(NaN(mobileNumber)) return res.status(400).json({message: 'Invalid mobile number'})

        //validate password
        if(password != confirmPassword) return res.status(400).json({message: 'Passwords do not match'})

        //check if email already in use
        const existingUser  =  await User.findOne({email})

        if(existingUser) return res.status(400).json({message: 'Email already in use'})

        //send data to onboarding ms to form a tenant
        const onboarding_res = await axios.post(ONBOARDING_API, {...req.body, email:email.toLowerCase()})

        if(!onboarding_res.status(201)) return res.status(500).json({message:'Could not create tenant at the moment. Please try again later'})

        const tenantId = onboarding_res.data.tenantId

        //create a combination of this 
        const hashedPassword = bcrypt.hash(password, saltRounds)
        const newUser = new User({
            tenantId,
            email,
            fullName,
            password: hashedPassword,
            otp:null,
            otpSentTime:null,
        })

        await newUser.save()

        return res.status(200).json({message: 'user created'})

    }catch(e){

    }
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };