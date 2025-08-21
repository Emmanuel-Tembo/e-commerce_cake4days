// controllers/orderController.js
import * as orderModel from '../model/orderModel.js';
import * as cartModel from '../model/cartModel.js';

export const createOrder = async (req, res) => {
    const { shippingDetails, cartItems, totalAmount } = req.body;
    
    
    const userId = req.user ? req.user.userId : null;

    if (!shippingDetails || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Missing shipping or cart data.' });
    }

    try {
        const orderId = await orderModel.createOrder(userId, shippingDetails, cartItems, totalAmount);
        
        // Only clear the cart if the user was authenticated.
        if (userId) {
            await cartModel.clearCart(userId);
        }
        
        res.status(201).json({ message: 'Order created successfully!', orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order.' });
    }
};


export const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }
        const orders = await orderModel.getOrdersByUserId(userId);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};