// src/model/profileModel.js
import { pool } from '../config/db.js';

// Function to get a standard user's profile and orders
export const getUserProfile = async (user_id) => {
    const query = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.phone_number,
            u.role,
            COUNT(DISTINCT o.order_id) AS total_orders,
            SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders,
            COUNT(DISTINCT w.wishlist_id) AS total_wishlist_items,
            (SELECT COUNT(*) FROM product_reviews pr WHERE pr.user_id = u.user_id) AS total_reviews
        FROM
            users u
        LEFT JOIN
            orders o ON u.user_id = o.user_id
        LEFT JOIN
            wishlists w ON u.user_id = w.user_id
        WHERE
            u.user_id = ?
        GROUP BY
            u.user_id;
    `;
    const [rows] = await pool.query(query, [user_id]);
    return rows[0];
};

// Function for admin to see their profile with extra data
export const getAdminProfile = async (user_id) => {
    const query = `
        SELECT
            u.user_id,
            u.username,
            u.email,
            u.phone_number,
            u.role,
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM orders) AS total_orders,
            (SELECT SUM(total_amount) FROM orders) AS total_revenue
        FROM
            users u
        WHERE
            u.user_id = ?;
    `;
    const [rows] = await pool.query(query, [user_id]);
    return rows[0];
};