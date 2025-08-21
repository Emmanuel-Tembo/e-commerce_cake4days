import { pool } from '../config/Db.js';

// Find a user's cart or create one if it doesn't exist
export const findOrCreateCart = async (userId) => {
    // Check if a cart already exists for the user
    const [rows] = await pool.query('SELECT * FROM shopping_cart WHERE user_id = ?', [userId]);
    if (rows.length > 0) {
        return rows[0].cart_id; // Return existing cart_id
    }

    // If no cart exists, create a new one
    const [result] = await pool.query('INSERT INTO shopping_cart (user_id) VALUES (?)', [userId]);
    return result.insertId; // Return the new cart_id
};

// Get all items in a user's cart
export const getCartItemsByUserId = async (userId) => {
    const [rows] = await pool.query(
        'SELECT ci.*, p.name, p.price, p.image_url FROM cart_items ci JOIN shopping_cart sc ON ci.cart_id = sc.cart_id JOIN products p ON ci.product_id = p.product_id WHERE sc.user_id = ?',
        [userId]
    );
    return rows;
};

// Add a product to the cart
export const addProductToCart = async (cartId, productId, quantity) => {
    // Check if the product is already in the cart
    const [existingItem] = await pool.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);

    if (existingItem.length > 0) {
        // If it exists, update the quantity
        const newQuantity = existingItem[0].quantity + quantity;
        const [result] = await pool.query('UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?', [newQuantity, existingItem[0].cart_item_id]);
        return result.affectedRows;
    } else {
        // If it doesn't exist, insert a new item
        const [result] = await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity]);
        return result.insertId;
    }
};

// Delete an item from the cart
export const deleteCartItem = async (cartId, cartItemId) => {
    const [result] = await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?', [cartId, cartItemId]);
    return result.affectedRows;
};

export const clearCart = async (userId) => {
    try {
        // Step 1: Find the user's cart_id
        const [cartResult] = await pool.query('SELECT cart_id FROM shopping_cart WHERE user_id = ?', [userId]);

        if (cartResult.length === 0) {
            console.log("No cart found for this user, no items to clear.");
            return;
        }

        const cartId = cartResult[0].cart_id;

        // Step 2: Delete all items associated with that cart_id
        const [result] = await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
        
        console.log(`Cleared ${result.affectedRows} items from cart for user ID: ${userId}`);

        return result;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};

