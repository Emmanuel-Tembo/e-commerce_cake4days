import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import * as authMode from '../model/authModel.js';
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; 


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// REGISTER

export const register = async (req,res) => {
    const{username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message: "Please put something in!!!!   "})
    }
    
    try {
        const existingUsername = await authMode.findUserbyName(username);
        if (existingUsername){
            return res.status(409).json({message: "Username already exists"})
        }

        const Hashpassword = await bcrypt.hash(password, SALT_ROUNDS)
        // Note: We now pass the 'user' role explicitly
        const userId = await authMode.createUser(username,email,Hashpassword, 'user');
        res.status(200).json({
            message: "USER CREATED SUCCESSFULLY!!",
            userId
        });
    } catch (e) {
        console.log('ERROR during registration', e);
        
        let errorMessage = 'Unexpected server error during registration';
        let statusCode = 500;

        if (e.code) {
            switch (e.code) {
                case 'ER_DUP_ENTRY':
                    statusCode = 409;
                    if (e.sqlMessage && e.sqlMessage.includes('for key \'users.username\'')){
                        errorMessage = 'Username already taken.';
                    } else if (e.sqlMessage && e.sqlMessage.includes('for key \'users.email\'')){
                        errorMessage = 'Email address already registered.';
                    } else {
                        errorMessage = 'A record with this information already exists.';
                    }
                    break;
                case 'ER_NO_REFERENCED_ROW_2':
                case 'ER_NO_REFERENCED_ROW':
                    statusCode = 400;
                    errorMessage = 'Employee ID does not exists in the employee database';
                    break;
                case 'ECONNREFUSED':
                case 'PROTOCOL_CONNECTION_LOST':
                    statusCode = 503;
                    errorMessage = 'Database connection error. Please try again later.';
                    break;
                default:
                    break;
            }
        } else if (e.message && e.message.includes('a foreign key constraint fails')){
            statusCode = 400;
            errorMessage = 'Employee ID does not exist in the employee database';
        }
        res.status(statusCode).json({message: errorMessage});
    }
}

const validateAdminPassword = (password) => {
    const errors = [];
    const minLength = 8;

    // Check for minimum length
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long.`);
    }

    // Check for character types using regular expressions
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Count the number of character types present
    const characterTypesPresent = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (characterTypesPresent < 4) {
        errors.push('Password must contain at least four of the following character types: uppercase, lowercase, number, and special character.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const createAdminUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email, and password." });
    }

    // --- NEW: Password Validation ---
    const validationResult = validateAdminPassword(password);
    if (!validationResult.isValid) {
        return res.status(400).json({
            message: "Password validation failed.",
            errors: validationResult.errors,
        });
    }
    // --- END NEW ---

    try {
        const existingUsername = await authMode.findUserbyName(username);
        if (existingUsername) {
            return res.status(409).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        // Note: We now pass the 'admin' role explicitly
        const userId = await authMode.createUser(username, email, hashedPassword, 'admin');

        res.status(201).json({
            message: "Admin user created successfully.",
            userId
        });
    } catch (e) {
        console.error('Error during admin user creation:', e);
        res.status(500).json({ message: 'Server error during admin user creation.' });
    }
};

// LOGIN (now uses email)
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(
            { message: 'Please provide email and password'});
    }

    try {
        const user = await authMode.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials',});
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.user_id, username: user.username, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 
        });

        res.status(200).json({ message: 'Login successful',token: token  });
    } catch (e) {
        console.error('Error during login: ', e);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// ADMIN LOGIN (now uses email)
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        // Find user by email
        const user = await authMode.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check for admin role
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.user_id, username: user.username, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.status(200).json({ 
            message: 'Admin login successful', 
            user: { 
                userId: user.user_id, 
                username: user.username, 
                role: user.role,
                email: user.email // Include email for a complete user object
            } 
});
    } catch (e) {
        console.error('Error during admin login: ', e);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// NEW LOGOUT FUNCTION
export const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logout successful' });
};

// Forgot Password - Handles the request to send a password reset email.
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await authMode.findUserByEmail(email);

        if (!user) {
            // To prevent user enumeration, always send a generic success message
            return res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
        }

        // Generate a secure, non-JWT token for database storage
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save the token and its expiry to the user's record in the database
        await authMode.saveResetToken(user.user_id, resetToken, resetTokenExpiry);

        // Construct the reset link that the user will click on, using a query parameter
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="${resetLink}">link</a> to reset your password.</p>
                <p>This link is only valid for 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });

    } catch (e) {
        console.error('Error in forgotPassword:', e);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};


export const resetPassword = async (req, res) => {
    // Correctly get the token and newPassword from the request body
    const { token, newPassword } = req.body; 

    if (!newPassword || !token) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    try {
        const user = await authMode.findUserByResetToken(token);

        if (!user) {
            // This is the correct place to return the "invalid or expired" error
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }
        
        // Add a check to prevent the token from being used multiple times
        if (user.reset_token !== token) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        await authMode.updateUserPasswordAndClearToken(user.user_id, hashedPassword);

        res.status(200).json({ message: 'Password has been successfully reset.' });

    } catch (e) {
        console.error('Error in resetPassword:', e);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};
