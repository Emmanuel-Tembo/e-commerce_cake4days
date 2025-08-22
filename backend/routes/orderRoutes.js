// routes/orderRoutes.js
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as orderCont from '../controller/orderController.js';
import { identifyUser } from '../middleware/guestAuthMiddleware.js';

const router = express.Router();

router.get('/user/orders', authenticateToken, orderCont.getOrdersByUser);

router.post('/orders', identifyUser, orderCont.createOrder);

export default router;