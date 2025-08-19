// models/paymentModel.js
import { pool } from '../config/Db.js';

export const createPayment = async (paymentData) => {
    const [result] = await pool.query('INSERT INTO payments SET ?', paymentData);
    return result.insertId;
};