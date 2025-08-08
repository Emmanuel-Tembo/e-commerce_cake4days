import express from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware.js';
import * as customOrderCont from '../controller/customOrderController.js';

const router = express.Router();

// User routes
router.post('/custom-orders', authenticateToken, customOrderCont.createCustomOrder);
router.get('/custom-orders/:id', authenticateToken, customOrderCont.getCustomOrderById);
router.delete('/custom-orders/:id', authenticateToken, customOrderCont.deleteCustomOrder);

// Admin routes
router.get('/admin/custom-orders', authenticateToken, checkAdmin, customOrderCont.getCustomOrders);

export default router;