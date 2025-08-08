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
        return res.status(400).json({message: "Please put something in!!!!   "})
    }
    
    try {
        // const existingId = await authMode.findUserById(emp_id);
        // if (existingId){
        //     return res.status(409).json({messge: "Eployee ID already exists"})
        // }

        const existingUsername = await authMode.findUserbyName(username);
        if (existingUsername){
            return res.status(409).json({message: "Username already exists"})
        }

        // Alowing registration 
        // first HASH PASSWORD
        const Hashpassword = await bcrypt.hash(password, SALT_ROUNDS)
        // THEN CREATE THE USER
        const userId = await authMode.createUser(username,email,Hashpassword);
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
                    } else if (e.sqlMessage && e.sqlMessage.includes('for key \'users.emp_id\'')) {
                        errorMessage = 'Employee ID is already registered.';
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


// A placeholder for what your login function might look like
export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: 'Please provide username and password'});
    }

    try {
        const user = await authMode.findUserbyName(username);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.user_id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (e) {
        console.error('Error during login: ', e);
        res.status(500).json({message: 'Server error during login'});
    }
};

// ... (your existing code)

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const user = await authMode.findUserbyName(username);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // --- NEW CHECK HERE ---
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Not an admin' });
        }
        // ----------------------

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.user_id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (e) {
        console.error('Error during admin login: ', e);
        res.status(500).json({ message: 'Server error during login' });
    }
};