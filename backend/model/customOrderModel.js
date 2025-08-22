import { pool } from "../config/Db.js";
import { generateOrderNumber } from '../controller/orderController.js';
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
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const {
            user_id,
            product_id,
            event_type,
            event_date,
            number_of_servings,
            budget_range,
            dietary_requirements,
            cake_type,
            preferred_flavours,
            special_requests,
            fullName, // from the form
            email,    // from the form
            phone,    // from the form
            streetAddress, // from the form
            city,
            state,
            zipCode,
            country
        } = orderData;
        
        // Step 1: Create a base entry in the 'orders' table.
        const orderNumber = generateOrderNumber();
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, order_type, total_amount, status, order_number) VALUES (?, ?, ?, ?, ?)',
            [user_id, 'custom', null, 'pending', orderNumber] // total_amount is null for custom orders until quoted
        );
        const orderId = orderResult.insertId;

        // Step 2: Insert the specific custom order details.
        const [detailsResult] = await connection.query(
            'INSERT INTO custom_order_details (order_id, product_id, event_type, event_date, number_of_servings, budget_range, dietary_requirements, cake_type, preferred_flavours, special_requests, inspiration_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                orderId,
                product_id || null, // Optional product_id
                event_type,
                event_date,
                number_of_servings || null,
                budget_range,
                dietary_requirements || null,
                cake_type,
                preferred_flavours,
                special_requests || null,
                // You'll need to handle file uploads separately to get a URL here
                null // inspiration_image_url
            ]
        );

        // Step 3: Insert into the 'shipping_details' table, linking to the new order.
        await connection.query(
            'INSERT INTO shipping_details (order_id, full_name, email, phone_number, street_address, city, state, zip_code, country, delivery_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                orderId,
                fullName,
                email,
                phone || null,
                streetAddress,
                city,
                state,
                zipCode,
                country,
                'delivery'
            ]
        );

        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        console.error('Error creating custom order:', error);
        throw error;
    } finally {
        connection.release();
    }
};;

// Delete a custom order
export const deleteCustomOrder = async (orderId) => {
    const [result] = await pool.query('DELETE FROM custom_orders WHERE order_id = ?', [orderId]);
    return result.affectedRows;
};