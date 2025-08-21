// middleware/guestAuthMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const identifyUser = (req, res, next) => {
    const token = req.cookies.auth_token;

    if (!token) {
        req.user = null; // No token, so the user is a guest
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            req.user = null; // Invalid token, so treat as a guest
            return next();
        }
        
        req.user = {
            userId: Number(user.userId),
            username: user.username,
            role: user.role
        };
        next();
    });
};