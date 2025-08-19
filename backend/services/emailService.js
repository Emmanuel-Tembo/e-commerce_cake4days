// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendInvoiceEmail = async (orderData) => {
    const emailBody = `
        <h1>CAKEFORDAYS Order Invoice</h1>
        <p>Thank you for your order, ${orderData.userName}!</p>
        <p>Order Number: ${orderData.orderNumber}</p>
        <p>Total Amount: R${orderData.totalAmount}</p>
        <h2>Items:</h2>
        <ul>
            ${orderData.items.map(item => `
                <li>${item.name} (x${item.quantity}) - R${item.price}</li>
            `).join('')}
        </ul>
        <p>We will notify you when your order has been prepared for delivery.</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderData.userEmail,
        subject: `Invoice for CAKEFORDAYS Order #${orderData.orderNumber}`,
        html: emailBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent successfully to ${orderData.userEmail}`);
    } catch (error) {
        console.error('Error sending invoice email:', error);
    }
};