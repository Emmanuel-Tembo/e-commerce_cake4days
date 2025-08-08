import * as customOrderModel from '../model/customOrderModel.js';

// Get all custom orders (Admin only)
export const getCustomOrders = async (req, res) => {
    try {
        const orders = await customOrderModel.findAllCustomOrders();
        res.status(200).json(orders);
    } catch (e) {
        console.error('Error fetching custom orders:', e);
        res.status(500).json({ message: 'Server error fetching custom orders.' });
    }
};

// Get a single custom order (User only - must be their own)
export const getCustomOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await customOrderModel.findCustomOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        // Ensure the order belongs to the logged-in user
        if (order.user_id !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied: You can only view your own orders.' });
        }
        res.status(200).json(order);
    } catch (e) {
        console.error('Error fetching custom order:', e);
        res.status(500).json({ message: 'Server error fetching custom order.' });
    }
};

// Create a custom order (User only)
// This function will handle creating a new custom order
export const createCustomOrder = async (req, res) => {
    // This is the data the user sends from the frontend
    const { full_name, ...orderData } = req.body;
    
    // The `user_id` comes from the verified JWT, not the request body
    const userIdFromToken = req.user.userId;

    if (!full_name) {
        return res.status(400).json({ message: 'Full name is required to create a custom order.' });
    }
    
    // We combine the data from the request body with the secure user ID from the token
    const finalOrderData = {
        user_id: userIdFromToken, // Use the ID from the JWT
        full_name,
        ...orderData
    };
    
    try {
        const orderId = await customOrderModel.createCustomOrder(finalOrderData);
        res.status(201).json({ message: 'Custom order created successfully!', orderId });
    } catch (e) {
        console.error('Error creating custom order:', e);
        res.status(500).json({ message: 'Server error creating custom order.' });
    }
};98

// Delete a custom order (Admin or User's own)
export const deleteCustomOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await customOrderModel.findCustomOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        
        // Admin or the user who owns the order can delete it
        if (req.user.role === 'admin' || order.user_id === req.user.userId) {
            const affectedRows = await customOrderModel.deleteCustomOrder(id);
            if (affectedRows > 0) {
                return res.status(200).json({ message: 'Custom order deleted successfully.' });
            }
        }
        
        // If the user is not an admin and doesn't own the order
        return res.status(403).json({ message: 'Access denied: You can only delete your own orders.' });
    } catch (e) {
        console.error('Error deleting custom order:', e);
        res.status(500).json({ message: 'Server error deleting custom order.' });
    }
};