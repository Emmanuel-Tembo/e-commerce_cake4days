import {pool} from '../config/db.js'

export const findUserbyName = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?',[username]);
    return rows[0];
}

export const findUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?',[email]);
    return rows[0];
}

export const createUser = async (username, email, Hashpassword,role) => {
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, Hashpassword, role]
    );
    return result.insertId;
};
     /**
 * Inserts a new user into the database.
 * The 'result.insertId' property returns the ID of the newly created row.
 * This is especially useful for tables with an AUTO_INCREMENT primary key,
 * as it allows you to get the unique identifier for the new record.
 */

export const updateUserPassword = async (userId, hashedPassword) => {
    await pool.query(
        'UPDATE users SET password_hash = ? WHERE user_id = ?',
        [hashedPassword, userId]
    );
};

// Add new functions here
export const updateUserPasswordAndClearToken = async (userId, hashedPassword) => {
    await pool.query(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?',
        [hashedPassword, userId]
    );
};   


export const saveResetToken = async (userId, resetToken, expiry) => {
    // Save the expiry as a simple timestamp (milliseconds)
    await pool.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
        [resetToken, expiry, userId]
    );
};

export const findUserByResetToken = async (token) => {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE reset_token = ?',
        [token]
    );

    const user = rows[0];

    // Check expiry here in the application logic
    if (user && user.reset_token_expiry > Date.now()) {
        return user;
    }

    return null; // Return null if the user isn't found or the token is expired
};
