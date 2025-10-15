// src/routes/profileRoutes.js
import express from 'express';
import * as profileCont from '../controller/ProfileCont.js'
import { authenticateToken } from '../middleware/authMiddleware.js'; // You'll create this middleware
const router = express.Router();
import * as userAddressCont from '../controller/userAddressController.js';

// This route is now protected and will use the user ID from the token
router.get('/profile', authenticateToken, profileCont.getProfile);;

// New Address Management Routes
router.get('/addresses', authenticateToken, userAddressCont.getUserAddresses);
router.post('/addresses', authenticateToken, userAddressCont.addUserAddress);
router.put('/addresses/:addressId', authenticateToken, userAddressCont.updateUserAddress);
router.delete('/addresses/:addressId', authenticateToken, userAddressCont.deleteUserAddress);

export default router;
