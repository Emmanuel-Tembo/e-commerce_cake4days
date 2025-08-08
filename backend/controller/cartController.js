import * as cartModel from '../model/cartModel.js';

// Get the user's cart
export const getCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const cartItems = await cartModel.getCartItemsByUserId(userId);
        res.status(200).json(cartItems);
    } catch (e) {
        console.error('Error fetching cart:', e);
        res.status(500).json({ message: 'Server error fetching cart.' });
    }
};

// Add a product to the user's cart
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Product ID and a valid quantity are required.' });
    }

    try {
        // Find or create the user's cart
        const cartId = await cartModel.findOrCreateCart(userId);
        
        // Add the product to the cart
        const affectedRows = await cartModel.addProductToCart(cartId, productId, quantity);
        
        if (affectedRows) {
            res.status(200).json({ message: 'Product added to cart successfully!' });
        } else {
            res.status(500).json({ message: 'Failed to add product to cart.' });
        }
    } catch (e) {
        console.error('Error adding to cart:', e);
        res.status(500).json({ message: 'Server error adding to cart.' });
    }
};

// Delete a cart item
export const deleteFromCart = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.userId;

    try {
        // Find the user's cart to ensure the item belongs to them
        const cartId = await cartModel.findOrCreateCart(userId);
        
        const affectedRows = await cartModel.deleteCartItem(cartId, itemId);

        if (affectedRows > 0) {
            res.status(200).json({ message: 'Item deleted from cart successfully!' });
        } else {
            res.status(404).json({ message: 'Item not found in your cart.' });
        }
    } catch (e) {
        console.error('Error deleting from cart:', e);
        res.status(500).json({ message: 'Server error deleting from cart.' });
    }
};