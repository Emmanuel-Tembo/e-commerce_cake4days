import express from 'express'
const router = express.Router();    

import * as authCont from '../controller/authCont.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/authMiddleware.js';

router.post('/register', authCont.register);
router.post('/login', authCont.login); // User login now uses email
router.post('/register/admin', authCont.createAdminUser);
router.post('/login/admin', authCont.loginAdmin); // Admin login now uses email
router.post('/logout', authCont.logout); 

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You accessed a protected route!',
        user: req.user
    });
});

// An example of a route that only admins can access
router.post('/admin/create-product', authenticateToken, checkAdmin, (req, res) => {
    // Your code to create a product here
    res.status(200).json({ message: 'Product created successfully by admin!' });
});

export default router;