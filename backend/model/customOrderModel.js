import { pool } from "../config/db.js";

// Get a custom order by its ID
export const findCustomOrderById = async (orderId) => {
    const [rows] = await pool.query('SELECT * FROM custom_orders WHERE order_id = ?', [orderId]);
    return rows[0];
};

// Get all custom orders for a specific user
export const findCustomOrdersByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM custom_orders WHERE user_id = ?', [userId]);
    return rows;
};

// Get all custom orders (for admins)
export const findAllCustomOrders = async () => {
    const [rows] = await pool.query('SELECT * FROM custom_orders');
    return rows;
};

// Create a new custom order
export const createCustomOrder = async (orderData) => {
    const { user_id, full_name, product_id, event_type, event_date, number_of_servings, budget_range, dietary_requirements, cake_type, preferred_flavours, special_requests } = orderData;
    const [result] = await pool.query(
        'INSERT INTO custom_orders (user_id, full_name, product_id, event_type, event_date, number_of_servings, budget_range, dietary_requirements, cake_type, preferred_flavours, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user_id, full_name, product_id, event_type, event_date, number_of_servings, budget_range, dietary_requirements, cake_type, preferred_flavours, special_requests]
    );
    return result.insertId;
};

// Delete a custom order
export const deleteCustomOrder = async (orderId) => {
    const [result] = await pool.query('DELETE FROM custom_orders WHERE order_id = ?', [orderId]);
    return result.affectedRows;
};