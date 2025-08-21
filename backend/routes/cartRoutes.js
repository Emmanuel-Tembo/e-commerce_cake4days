import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as cartCont from '../controller/cartController.js';

const router = express.Router();

router.get('/cart', authenticateToken, cartCont.getCart);
router.post('/cart/add', authenticateToken, cartCont.addToCart);
router.delete('/cart/:itemId', authenticateToken, cartCont.deleteFromCart);

export default router;