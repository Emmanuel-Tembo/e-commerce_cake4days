import * as salesReportModel from '../model/salesReportModel.js';

// Get a specific sales report (Admin only)
export const getSalesReport = async (req, res) => {
    const { reportId } = req.params;
    try {
        const report = await salesReportModel.getSalesReportById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Sales report not found.' });
        }
        res.status(200).json(report);
    } catch (e) {
        console.error('Error fetching sales report:', e);
        res.status(500).json({ message: 'Server error fetching sales report.' });
    }
};

// Generate a new sales report (Admin only)
export const generateSalesReport = async (req, res) => {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start and end dates are required.' });
    }
    try {
        const reportId = await salesReportModel.generateAndSaveSalesReport(startDate, endDate);
        res.status(201).json({ message: 'Sales report generated and saved successfully!', reportId });
    } catch (e) {
        console.error('Error generating sales report:', e);
        res.status(500).json({ message: 'Server error generating sales report.' });
    }
};

// Get the latest sales report (Admin only)
export const getLatestSalesReport = async (req, res) => {
    try {
        const report = await salesReportModel.getLatestSalesReport();
        if (!report) {
            return res.status(404).json({ message: 'No sales reports found.' });
        }
        res.status(200).json(report);
    } catch (e) {
        console.error('Error fetching latest sales report:', e);
        res.status(500).json({ message: 'Server error fetching latest sales report.' });
    }
};