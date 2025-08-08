import express from 'express';
import { authenticateToken, checkAdmin } from '../middleware/authMiddleware.js';
import * as salesReportCont from '../controller/salesReportController.js';

const router = express.Router();

// Get the latest sales report
router.get('/admin/sales/latest', authenticateToken, checkAdmin, salesReportCont.getLatestSalesReport);

// Get a specific sales report by ID
router.get('/admin/sales/:reportId', authenticateToken, checkAdmin, salesReportCont.getSalesReport);

// Generate a new sales report
router.post('/admin/sales/generate', authenticateToken, checkAdmin, salesReportCont.generateSalesReport);

export default router;