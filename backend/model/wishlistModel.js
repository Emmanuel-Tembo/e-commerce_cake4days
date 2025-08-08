import { pool } from '../config/db.js';

// Add a product to a user's wishlist
export const addProductToWishlist = async (userId, productId) => {
    // Check if the product is already in the wishlist to prevent duplicates
    const [existingItem] = await pool.query('SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);

    if (existingItem.length > 0) {
        return 0; // Item already exists, return 0 affected rows
    }
    
    const [result] = await pool.query(
        'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
    );
    return result.affectedRows;
};

// Get all wishlist items for a user, including product details
export const getWishlistItemsByUserId = async (userId) => {
    const [rows] = await pool.query(
        `SELECT
            w.wishlist_id,
            w.added_at,
            p.product_id,
            p.name,
            p.price,
            p.image_url,
            p.intended_audience
        FROM wishlists w
        JOIN products p ON w.product_id = p.product_id
        WHERE w.user_id = ?
        ORDER BY w.added_at DESC`,
        [userId]
    );
    return rows;
};

// Delete a product from a user's wishlist
export const deleteProductFromWishlist = async (userId, productId) => {
    const [result] = await pool.query(
        'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
        [userId, productId]
    );
    return result.affectedRows;
};