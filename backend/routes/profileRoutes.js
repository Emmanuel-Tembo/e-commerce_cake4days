// src/routes/profileRoutes.js
import express from 'express';
import { getProfile } from '../controller/ProfileCont.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // You'll create this middleware
const router = express.Router();

// This route is now protected and will use the user ID from the token
router.get('/profile', authenticateToken, getProfile);
export default router;