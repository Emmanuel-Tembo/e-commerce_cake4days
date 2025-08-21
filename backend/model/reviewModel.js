import { pool } from '../config/Db.js';

// Create a new review
export const createReview = async (userId, productId, rating, reviewText) => {
    const [result] = await pool.query(
        'INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [userId, productId, rating, reviewText]
    );
    return result.insertId;
};

// Get all reviews for a specific product
export const getReviewsByProductId = async (productId) => {
    const [rows] = await pool.query(
        'SELECT r.*, u.username FROM product_reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? ORDER BY r.review_date DESC',
        [productId]
    );
    return rows;
};

// Get a single review by its ID
export const getReviewById = async (reviewId) => {
    const [rows] = await pool.query(
        'SELECT * FROM product_reviews WHERE review_id = ?',
        [reviewId]
    );
    return rows[0];
};

// Delete a review
export const deleteReview = async (reviewId) => {
    const [result] = await pool.query(
        'DELETE FROM product_reviews WHERE review_id = ?',
        [reviewId]
    );
    return result.affectedRows;
};