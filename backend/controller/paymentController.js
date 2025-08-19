// controllers/paymentController.js
import { updateOrderStatus, findByOrderId, findOrderItems } from '../model/orderModel.js';
import { createPayment } from '../model/paymentModel.js';
import { sendInvoiceEmail } from '../services/emailService.js';

export const processMockPayment = async (req, res) => {
    // This is the core logic you'll build upon
    const { orderId, amount, paymentMethod, paymentDetails } = req.body;

    if (!orderId || !amount || !paymentMethod) {
        return res.status(400).json({ success: false, message: 'Missing required payment data.' });
    }

    let success = false;
    let message = '';

    // Mock payment logic
    if (paymentMethod === 'creditCard') {
        success = true;
        message = 'Credit card payment successful.';
    } else if (paymentMethod === 'paypal') {
        success = true;
        message = 'PayPal payment authorized.';
    } else if (paymentMethod === 'googlePay') {
        success = true;
        message = 'Google Pay payment processed.';
    } else {
        message = 'Unknown payment method.';
    }

    if (success) {
        try {
            // Use the models to update the database
            await updateOrderStatus(orderId, 'paid');
            await createPayment({
                order_id: orderId,
                payment_method: paymentMethod,
                amount_paid: amount,
                payment_status: 'paid',
                payment_date: new Date()
            });

            // Fetch order details for the email
            const orderData = await findByOrderId(orderId);
            const orderItems = await findOrderItems(orderId);

            const emailData = {
                orderNumber: orderData.order_number,
                userName: orderData.username,
                userEmail: orderData.email,
                totalAmount: orderData.total_amount,
                items: orderItems,
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