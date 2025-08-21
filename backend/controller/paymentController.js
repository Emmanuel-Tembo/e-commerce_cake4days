// controllers/paymentController.js
import { updateOrderStatus, findByOrderId, findOrderItems } from '../model/orderModel.js';
import { createPayment } from '../model/paymentModel.js';
import { sendInvoiceEmail } from '../services/emailService.js';
import { getOrderIdByOrderNumber } from '../model/orderModel.js';

export const processMockPayment = async (req, res) => {
    // 1. Change to accept orderNumber instead of orderId
    const { orderNumber, amount, paymentMethod, paymentDetails, user, orderDetails } = req.body;

    if (!orderNumber || !amount || !paymentMethod || !user || !orderDetails) {
        return res.status(400).json({ success: false, message: 'Missing required payment data.' });
    }

    const finalAmount = parseFloat(amount);
    if (isNaN(finalAmount)) {
        return res.status(400).json({ success: false, message: 'Invalid amount provided.' });
    }

    let success = false;
    let message = '';

    // Mock payment logic
    if (paymentMethod === 'creditCard' || paymentMethod === 'paypal' || paymentMethod === 'googlePay') {
        success = true;
        message = 'Payment successful.';
    } else {
        message = 'Unknown payment method.';
    }

    if (success) {
        try {
            // 2. Fetch the internal orderId using the orderNumber
            const order = await getOrderIdByOrderNumber(orderNumber);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }
            const orderId = order.order_id;

            // 3. Use the internal orderId for database operations
            await updateOrderStatus(orderId, 'paid');
            await createPayment({
                order_id: orderId,
                payment_method: paymentMethod,
                amount_paid: finalAmount,
                payment_status: 'paid'
            });

            const emailData = {
                orderNumber: orderNumber, // Use the user-facing order number
                userName: user.fullName,
                userEmail: user.email,
                totalAmount: finalAmount,
                items: orderDetails.cartItems,
            };
            await sendInvoiceEmail(emailData);

            return res.status(200).json({ 
                success: true, 
                message: 'Payment successful and order updated.',
                orderNumber: orderNumber // Return the order number to the frontend
            });
        } catch (error) {
            console.error('Database or Email Error:', error);
            return res.status(500).json({ success: false, message: 'Server error during payment processing.' });
        }
    } else {
        return res.status(400).json({ success: false, message: message });
    }
};