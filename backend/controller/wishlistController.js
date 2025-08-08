import * as wishlistModel from '../model/wishlistModel.js';

// Get the user's wishlist
export const getWishlist = async (req, res) => {
    const userId = req.user.userId;
    try {
        const wishlistItems = await wishlistModel.getWishlistItemsByUserId(userId);
        res.status(200).json(wishlistItems);
    } catch (e) {
        console.error('Error fetching wishlist:', e);
        res.status(500).json({ message: 'Server error fetching wishlist.' });
    }
};

// Add a product to the user's wishlist
export const addToWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        const affectedRows = await wishlistModel.addProductToWishlist(userId, productId);
        if (affectedRows > 0) {
            res.status(201).json({ message: 'Product added to wishlist successfully!' });
        } else {
            res.status(409).json({ message: 'Product is already in your wishlist.' });
        }
    } catch (e) {
        console.error('Error adding to wishlist:', e);
        res.status(500).json({ message: 'Server error adding to wishlist.' });
    }
};

// Delete a product from the user's wishlist
export const deleteFromWishlist = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        const affectedRows = await wishlistModel.deleteProductFromWishlist(userId, productId);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Product deleted from wishlist successfully!' });
        } else {
            res.status(404).json({ message: 'Product not found in your wishlist.' });
        }
    } catch (e) {
        console.error('Error deleting from wishlist:', e);
        res.status(500).json({ message: 'Server error deleting from wishlist.' });
    }
};