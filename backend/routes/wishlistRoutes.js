import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as wishlistCont from '../controller/wishlistController.js';

const router = express.Router();

router.get('/wishlist', authenticateToken, wishlistCont.getWishlist);
router.post('/wishlist', authenticateToken, wishlistCont.addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, wishlistCont.deleteFromWishlist);

export default router;