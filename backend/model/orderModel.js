// models/orderModel.js
import { pool } from '../config/Db.js';

export const findByOrderId = async (orderId) => {
    const [rows] = await pool.query('SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.order_id = ?', [orderId]);
    return rows[0];
};

export const updateOrderStatus = async (orderId, status) => {
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
};

export const findOrderItems = async (orderId) => {
    const [rows] = await pool.query('SELECT p.name, oi.quantity, oi.price FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?', [orderId]);
    return rows;
};