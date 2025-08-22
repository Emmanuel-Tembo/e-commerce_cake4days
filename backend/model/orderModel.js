// models/orderModel.js
// Updated to handle user-saved addresses during checkout.
import { pool } from '../config/Db.js';

// Function to create a payment record using your table schema
export const createPayment = async (connection, orderId, paymentMethod, amountPaid) => {
    const [result] = await connection.execute(
        'INSERT INTO payments (order_id, payment_method, amount_paid, payment_status) VALUES (?, ?, ?, ?)',
        [orderId, paymentMethod, amountPaid, 'paid']
    );
    return result.insertId;
};

// **NEW FUNCTION**: Fetches a specific user address by ID.
export const getUserAddressById = async (userId, addressId) => {
    const [rows] = await pool.query('SELECT * FROM user_addresses WHERE user_id = ? AND address_id = ?', [userId, addressId]);
    return rows[0] || null;
};
export const getUserDetailsById = async (userId) => {
    const [rows] = await pool.query('SELECT username, email, phone_number FROM users WHERE user_id = ?', [userId]);
    return rows[0] || null;
};

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

export const createOrder = async (userId, shippingDetails, cartItems, totalAmount, orderNumber, saveDetails, paymentMethod) => {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
try {
        let finalShippingDetails = shippingDetails;
        
        if (shippingDetails.addressId) {
    const savedAddress = await getUserAddressById(userId, shippingDetails.addressId);
    const userDetails = await getUserDetailsById(userId);

    if (savedAddress && userDetails) {
        finalShippingDetails = {
            fullName: userDetails.username,
            email: userDetails.email,
            phoneNumber: userDetails.phoneNumber || savedAddress.phone_number || null, // 💡 This line is key
            streetAddress: savedAddress.street_address || null,
            city: savedAddress.city || null,
            state: savedAddress.state || null,
            zipCode: savedAddress.zip_code || null,
            country: savedAddress.country || null,
        };
    } else {
        throw new Error('Invalid address ID provided.');
    }
}
        // 1. Insert into orders table with the generated order number
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, order_number, total_amount, status) VALUES (?, ?, ?, ?)',
            [userId, orderNumber, totalAmount, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Insert into shipping_details table, linking to the new order
      await connection.execute(
    'INSERT INTO shipping_details (order_id, full_name, email, phone_number, street_address, city, state, zip_code, country, delivery_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
        orderId,
        finalShippingDetails.fullName || null, // Ensure this isn't undefined
        finalShippingDetails.email || null,    // Ensure this isn't undefined
        finalShippingDetails.phoneNumber || null, // This is the crucial line
        finalShippingDetails.streetAddress || null, // Ensure this isn't undefined
        finalShippingDetails.city || null,
        finalShippingDetails.state || null,
        finalShippingDetails.zipCode || null,
        finalShippingDetails.country || null,
        'delivery' 
    ]
);
        // 3. Insert into order_items table for each item
        for (const item of cartItems) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // 4. Check if the user is authenticated AND chose to save details
        if (userId && saveDetails) {
            const [existingAddress] = await connection.execute('SELECT * FROM user_addresses WHERE user_id = ?', [userId]);
            
            if (existingAddress.length > 0) {
                // Update existing address
                await connection.execute(
                    'UPDATE user_addresses SET street_address = ?, city = ?, state = ?, zip_code = ? WHERE user_id = ?',
                    [finalShippingDetails.streetAddress, finalShippingDetails.city, finalShippingDetails.state, finalShippingDetails.zipCode, userId]
                );
            } else {
                // Insert new address
                await connection.execute(
                    'INSERT INTO user_addresses (user_id, street_address, city, state, zip_code, country) VALUES (?, ?, ?, ?, ?, ?)',
                    [userId, finalShippingDetails.streetAddress, finalShippingDetails.city, finalShippingDetails.state, finalShippingDetails.zipCode, finalShippingDetails.country]
                );
            }
        }
        
        await createPayment(connection, orderId, paymentMethod, totalAmount);

        await connection.commit();
        return { orderId, orderNumber };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
