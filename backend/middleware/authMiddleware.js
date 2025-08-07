import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

export const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null){
        console.log('NO token Provided');
        return res.status(401).json({messege: 'authtokenRequired'});
    }

    jwt.verify(token, JWT_SECRET,(e,user) => {
        if (e){
            console.error('Token verification failed:', e.message);
            return res.status(403).json({message: 'Invalid or expired token.'})
        }
        req.user = user
        next();
    });
};