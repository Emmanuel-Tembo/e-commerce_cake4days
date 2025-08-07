import express from 'express'
const router = express.Router();    

import * as authCont from '../controller/authCont.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.post('/register', authCont.register);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'You accessed a protected route!',
        user: req.user
    });
});

export default router;