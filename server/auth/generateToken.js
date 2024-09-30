import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const generateJWT = (tenantId,empId)=>{
    return jwt.sign({tenantId, empId},process.env.JWT_SECRET,{expiresIn:'1h'});
}

export {generateJWT}