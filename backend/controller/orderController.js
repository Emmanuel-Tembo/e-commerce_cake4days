// controllers/orderController.js
import * as orderModel from '../model/orderModel.js';
import * as cartModel from '../model/cartModel.js';

const generateOrderNumber = () => {
    // A simple unique number, e.g., based on timestamp and a random value
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createOrder = async (req, res) => {
    const { shippingDetails, cartItems, totalAmount, saveDetails } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!shippingDetails || !cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: 'Missing shipping or cart data.' });
    }

    try {
        const orderNumber = generateOrderNumber(); // Generate the unique order number

        const result = await orderModel.createOrder(userId, shippingDetails, cartItems, totalAmount, orderNumber, saveDetails);
        
        if (userId) {
            await cartModel.clearCart(userId);
        }
        
        res.status(201).json({ message: 'Order created successfully!', orderNumber: result.orderNumber });
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