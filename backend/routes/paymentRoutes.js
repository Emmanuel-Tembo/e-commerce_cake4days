// routes/paymentRoutes.js
import express from 'express';
import { processMockPayment } from '../controller/paymentController.js';

const router = express.Router();

// Route for all payment-related requests
router.post('/payments/process', processMockPayment);

export default router;