import { pool } from '../config/Db.js';

// Get a sales report by its ID
export const getSalesReportById = async (reportId) => {
    const [rows] = await pool.query(
        'SELECT * FROM sales_reports WHERE report_id = ?',
        [reportId]
    );
    return rows[0];
};

// Get the latest sales report
export const getLatestSalesReport = async () => {
    const [rows] = await pool.query(
        'SELECT * FROM sales_reports ORDER BY date_range_end DESC LIMIT 1'
    );
    return rows[0];
};

// A function to generate and save a new sales report (Admin only)
export const generateAndSaveSalesReport = async (startDate, endDate) => {
    // This is a complex query to calculate total sales and orders
    const [salesResult] = await pool.query(
        'SELECT SUM(total_amount) AS total_sales, COUNT(order_id) AS total_orders FROM orders WHERE order_date BETWEEN ? AND ?',
        [startDate, endDate]
    );

    // This query finds the top product
    const [topProductResult] = await pool.query(
        'SELECT product_id, SUM(quantity) AS total_quantity FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE o.order_date BETWEEN ? AND ? GROUP BY product_id ORDER BY total_quantity DESC LIMIT 1',
        [startDate, endDate]
    );

    const totalSales = salesResult[0].total_sales || 0;
    const totalOrders = salesResult[0].total_orders || 0;
    const topProductId = topProductResult[0]?.product_id || null;

    // Insert the generated report into the sales_reports table
    const [result] = await pool.query(
        'INSERT INTO sales_reports (date_range_start, date_range_end, total_sales, total_orders, top_product_id) VALUES (?, ?, ?, ?, ?)',
        [startDate, endDate, totalSales, totalOrders, topProductId]
    );

    return result.insertId;
};