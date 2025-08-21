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

export const getOrdersByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
};

export const createOrder = async (userId, shippingDetails, cartItems, totalAmount) => {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
        const [orderResult] = await conn.query('INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)', [userId, totalAmount, 'pending']);
        const orderId = orderResult.insertId;

        // **FIXED: Map the JavaScript object keys to the correct SQL column names**
        const shippingPayload = {
            order_id: orderId,
            full_name: shippingDetails.fullName, // Mapped from fullName
            email: shippingDetails.email,
            phone_number: shippingDetails.phoneNumber, // Mapped from phoneNumber
            street_address: shippingDetails.streetAddress, // Mapped from streetAddress
            city: shippingDetails.city,
            state: shippingDetails.state,
            zip_code: shippingDetails.zipCode, // Mapped from zipCode
            country: shippingDetails.country,
            delivery_method: shippingDetails.delivery_method
        };
        await conn.query('INSERT INTO shipping_details SET ?', shippingPayload);

        const orderItemPromises = cartItems.map(item => {
            return conn.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product_id, item.quantity, item.price]);
        });
        await Promise.all(orderItemPromises);

        await conn.commit();
        conn.release();
        return orderId;
    } catch (e) {
        await conn.rollback();
        conn.release();
        throw e;
    }
};