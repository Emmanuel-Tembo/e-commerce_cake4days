// controllers/paymentController.js
import { updateOrderStatus, findByOrderId, findOrderItems } from '../model/orderModel.js';
import { createPayment } from '../model/paymentModel.js';
import { sendInvoiceEmail } from '../services/emailService.js';

export const processMockPayment = async (req, res) => {
    // These are the details you should get from the frontend request body
    const { orderId, amount, paymentMethod, paymentDetails, user, orderDetails } = req.body;

    if (!orderId || !amount || !paymentMethod || !user || !orderDetails) {
        return res.status(400).json({ success: false, message: 'Missing required payment data.' });
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
            await updateOrderStatus(orderId, 'paid');
            await createPayment({
                order_id: orderId,
                payment_method: paymentMethod,
                amount_paid: amount,
                payment_status: 'paid',
                payment_date: new Date()
            });

            // The data needed for the email is now passed directly from the frontend
            const emailData = {
                orderNumber: orderId, // You can use orderId as a simple order number
                userName: user.fullName,
                userEmail: user.email,
                totalAmount: amount,
                items: orderDetails.cartItems, // Assumes cart items are in the payload
            };

            await sendInvoiceEmail(emailData);

            return res.status(200).json({ success: true, message: 'Payment successful and order updated.' });
        } catch (error) {
            console.error('Database or Email Error:', error);
            return res.status(500).json({ success: false, message: 'Server error during payment processing.' });
        }
    } else {
        return res.status(400).json({ success: false, message: message });
    }
};
