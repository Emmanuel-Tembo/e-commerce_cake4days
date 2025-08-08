import express from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware.js';
import * as reviewCont from '../controller/reviewController.js';

const router = express.Router();

router.get('/products/:productId/reviews', reviewCont.getProductReviews);
router.post('/products/:productId/reviews', authenticateToken, reviewCont.createReview);
router.delete('/reviews/:reviewId', authenticateToken, reviewCont.deleteReview);

//admin
router.delete('/admin/reviews/:reviewId', authenticateToken, checkAdmin, reviewCont.deleteReview);

export default router;