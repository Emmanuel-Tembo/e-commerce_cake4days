// authMiddleware.js - Middleware
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    // 1. Check for token in the HTTP-only cookie first.
    // The 'auth_token' key must match what you used in the login function.
    const token = req.cookies.auth_token;
    
    // 2. Fallback to checking the Authorization header if no cookie is found.
    // This allows you to still use tools like Postman with the Bearer token.
    if (!token) {
        const authHeader = req.headers['authorization'];
        const headerToken = authHeader && authHeader.split(' ')[1];
        if (headerToken) {
            token = headerToken;
        }
    }

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (e, user) => {
        if (e) {
            console.error('Token verification failed:', e.message);
            // Clear the invalid cookie to prevent repeated failures
            res.clearCookie('auth_token'); // Corrected cookie name
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

export const checkAdmin = (req, res, next) => {
    // req.user is set by the authenticateToken middleware
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, so they can proceed
    } else {
        res.status(403).json({ message: 'Access denied: Admins only.' });
    }
};
