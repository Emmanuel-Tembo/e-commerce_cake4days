import express from 'express'
const router = express.Router();    

import * as authCont from '../controller/authCont.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/authMiddleware.js';

router.post('/register', authCont.register);
router.post('/login', authCont.login); // Your existing user login route
router.post('/login/admin', authCont.loginAdmin); // NEW admin login route

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You accessed a protected route!',
        user: req.user
    });
});

// . Frontend Implementation
// On your frontend, your two login pages will simply send their requests to different endpoints.
// The User Login page will send credentials to /auth/login.
// The Admin Login page will send credentials to /auth/login/admin.


// An example of a route that only admins can access
router.post('/admin/create-product', authenticateToken, checkAdmin, (req, res) => {
    // Your code to create a product here
    res.status(200).json({ message: 'Product created successfully by admin!' });
});

export default router;