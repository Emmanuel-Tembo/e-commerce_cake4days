// controllers/orderController.js
// Updated to handle both direct shipping details and a saved addressId.
import * as orderModel from '../model/orderModel.js';
import * as cartModel from '../model/cartModel.js';
import { sendInvoiceEmail } from '../services/emailService.js';

export const generateOrderNumber = () => {
    // A simple unique number, e.g., based on timestamp and a random value
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Handles the complete order and payment process in one single action.
 */
export const createOrder = async (req, res) => {
    const { shippingDetails, cartItems, totalAmount, paymentDetails, saveDetails, addressId } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!cartItems || cartItems.length === 0 || !paymentDetails) {
        return res.status(400).json({ message: 'Missing required data for order creation.' });
    }

    // NEW LOGIC: Check if an addressId is provided instead of full shipping details.
    if (!shippingDetails && !addressId) {
        return res.status(400).json({ message: 'Missing required shipping data for order creation.' });
    }

    // --- MOCK PAYMENT LOGIC INTEGRATED HERE ---
    // Fix: Destructure 'method' instead of 'paymentMethod' to match the frontend
    const { method } = paymentDetails; 
    let paymentSuccess = false;
    let paymentMessage = '';

    // Fix: Use the 'method' variable
    if (method === 'card' || method === 'paypal') { // Note: I changed 'creditCard' to 'card' to match your frontend
        paymentSuccess = true;
        paymentMessage = 'Payment successful.';
    } else {
        paymentMessage = 'Unknown payment method.';
    }

    // --- END MOCK PAYMENT LOGIC ---

    try {
        const orderNumber = generateOrderNumber(); 

        // Pass the addressId and shippingDetails to the model.
        // The model will handle which one to use.
        const result = await orderModel.createOrder(userId, { ...shippingDetails, addressId }, cartItems, totalAmount, orderNumber, saveDetails, method);
        
        if (userId) {
            await cartModel.clearCart(userId);
        }

        const emailData = {
            orderNumber: result.orderNumber,
            userName: (shippingDetails && shippingDetails.fullName) || 'User',
            userEmail: (shippingDetails && shippingDetails.email) || '',
            totalAmount: totalAmount,
            items: cartItems
        };
        await sendInvoiceEmail(emailData);
        
        res.status(201).json({ message: 'Order created and paid successfully!', orderNumber: result.orderNumber });
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
