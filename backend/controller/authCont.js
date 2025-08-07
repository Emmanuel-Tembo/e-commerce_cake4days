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
