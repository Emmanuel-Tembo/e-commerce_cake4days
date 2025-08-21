// models/orderModel.js
import { pool } from '../config/Db.js';

export const findByOrderId = async (orderId) => {
    const [rows] = await pool.query('SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.user_id WHERE o.order_id = ?', [orderId]);
    return rows[0];
};

export const getOrderIdByOrderNumber = async (orderNumber) => {
    const [rows] = await pool.query('SELECT order_id FROM orders WHERE order_number = ?', [orderNumber]);
    return rows[0] || null;
};

export const updateOrderStatus = async (orderId, status) => {
    await pool.query('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
};

export const findOrderItems = async (orderId) => {
    const [rows] = await pool.query('SELECT p.name, oi.quantity, oi.price FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?', [orderId]);
    return rows;
};

export const getOrdersByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
};

export const createOrder = async (userId, shippingDetails, cartItems, totalAmount, orderNumber, saveDetails) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Insert into orders table with the generated order number
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, order_number, total_amount, status) VALUES (?, ?, ?, ?)',
            [userId, orderNumber, totalAmount, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Insert into shipping_details table, linking to the new order
        await connection.execute(
            'INSERT INTO shipping_details (order_id, full_name, email, phone_number, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                orderId,
                shippingDetails.fullName,
                shippingDetails.email,
                shippingDetails.phoneNumber,
                shippingDetails.streetAddress,
                shippingDetails.city,
                shippingDetails.state,
                shippingDetails.zipCode,
                shippingDetails.country,
            ]
        );

        // 3. Insert into order_items table for each item
        for (const item of cartItems) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }
        
        // 4. (NEW) Check if the user is authenticated AND chose to save details
        if (userId && saveDetails) {
            // This is a simplified check. You would need to check if an address already exists for the user.
            const [existingAddress] = await connection.execute('SELECT * FROM user_addresses WHERE user_id = ?', [userId]);
            
            if (existingAddress.length > 0) {
                // Update existing address
                await connection.execute(
                    'UPDATE user_addresses SET street_address = ?, city = ?, state = ?, zip_code = ? WHERE user_id = ?',
                    [shippingDetails.streetAddress, shippingDetails.city, shippingDetails.state, shippingDetails.zipCode, userId]
                );
            } else {
                // Insert new address
                await connection.execute(
                    'INSERT INTO user_addresses (user_id, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?)',
                    [userId, shippingDetails.streetAddress, shippingDetails.city, shippingDetails.state, shippingDetails.zipCode, shippingDetails.country]
                );
            }
        }
        
        await connection.commit();
        return { orderId, orderNumber }; // Return both IDs for clarity
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};