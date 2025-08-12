import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authMode from '../model/authModel.js';
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; 

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

export const createAdminUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email, and password." });
    }

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
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await authMode.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
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

        res.status(200).json({ message: 'Login successful' });
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

        res.status(200).json({ message: 'Admin login successful' });
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

