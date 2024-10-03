import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET
console.log({jwtSecret})

const verifyJwt = (req, res, next) => {
    const token = req.cookies.authToken;
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Unauthorized access.' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err);
            return res.status(403).json({ message: 'Invalid token. Access forbidden.' });
        }
        req.user = decoded; // Contains tenantId, empId
        next();
    });
};

export {
    verifyJwt
}