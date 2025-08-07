import {pool} from '../config/db.js'

export const findUserbyName = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
    return rows[0];
}

// export const findUserById = async (empId) => {
//     const [empRows] = await pool.query('SELECT * FROM users WHERE emp_id = ?',[empId])
//     return empRows[0];
// }

export const createUser = async (username,email,Hashpassword) => {
    const [result] = await pool.query('INSERT INTO users (username,email,password_hash) VALUES (?,?,?)',[username,email,Hashpassword]);
    return result.insertId;
    /**
 * Inserts a new user into the database.
 * The 'result.insertId' property returns the ID of the newly created row.
 * This is especially useful for tables with an AUTO_INCREMENT primary key,
 * as it allows you to get the unique identifier for the new record.
 */
}