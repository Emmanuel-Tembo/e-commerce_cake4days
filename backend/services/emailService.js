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

export const sendCustomOrderConfirmationEmail = async ({ 
    userEmail, 
    userName, 
    orderId, 
    occasion, // <-- These are now at the top level
    eventDate,
    servings,
    dietaryRequirements,
    cakeType,
    flavors,
    budget,
    description
}) => {
    const emailBody = `
        <h1>CAKEFORDAYS Custom Order Confirmation</h1>
        <p>Hi ${userName},</p>
        <p>Thank you for submitting your custom cake order! We have received your request and will review it shortly. A team member will contact you within 24 hours to discuss the details, provide a quote, and finalize your order.</p>
        <hr>
        <h2>Order Details</h2>
        <p><strong>Order Reference:</strong> #${orderId}</p>
        <p><strong>Occasion:</strong> ${occasion}</p>
        <p><strong>Event Date:</strong> ${eventDate}</p>
        <p><strong>Number of Servings:</strong> ${servings}</p>
        <p><strong>Dietary Requirements:</strong> ${dietaryRequirements || 'None'}</p>
        <p><strong>Cake Type:</strong> ${cakeType}</p>
        <p><strong>Flavors:</strong> ${flavors}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Special Requests:</strong> ${description || 'None'}</p>
        <hr>
        <p>We look forward to creating the perfect cake for you!</p>
        <p>Best regards,</p>
        <p>The CAKEFORDAYS Team</p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Custom Order Confirmation from CAKEFORDAYS #${orderId}`,
        html: emailBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Custom order confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending custom order confirmation email:', error);
    }
};