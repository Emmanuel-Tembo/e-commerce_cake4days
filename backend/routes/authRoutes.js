import express from 'express'
const router = express.Router();

import * as authCont from '../controller/authCont.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { checkAdmin } from '../middleware/authMiddleware.js';

router.post('/register', authCont.register);
router.post('/login', authCont.login);
router.post('/register/admin', authCont.createAdminUser);
router.post('/login/admin', authCont.loginAdmin);
router.post('/logout', authCont.logout);
router.post('/forgot-password', authCont.forgotPassword);

// Corrected route to handle the token from the request body
router.post('/reset-password', authCont.resetPassword);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You accessed a protected route!',
        user: req.user
    });
});

router.post('/admin/create-product', authenticateToken, checkAdmin, (req, res) => {
    res.status(200).json({ message: 'Product created successfully by admin!' });
});

export default router;