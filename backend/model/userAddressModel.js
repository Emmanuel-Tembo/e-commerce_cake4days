// models/userAddressModel.js
import { pool } from '../config/Db.js';

// Get all addresses for a user
export const getAddressesByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, address_id ASC', [userId]);
    return rows;
};

// Add a new address for a user
export const addAddress = async (userId, addressData) => {
    // If the new address is set as default, we must first unset the current default
    if (addressData.is_default) {
        await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const [result] = await pool.query(
        'INSERT INTO user_addresses (user_id, street_address, city, state, zip_code, country, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            userId,
            addressData.street_address,
            addressData.city,
            addressData.state,
            addressData.zip_code,
            addressData.country,
            addressData.is_default
        ]
    );
    return result.insertId;
};

// Update an existing address
export const updateAddress = async (userId, addressId, addressData) => {
    // If updating to default, unset all others
    if (addressData.is_default) {
        await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const [result] = await pool.query(
        'UPDATE user_addresses SET street_address = ?, city = ?, state = ?, zip_code = ?, country = ?, is_default = ? WHERE user_id = ? AND address_id = ?',
        [
            addressData.street_address,
            addressData.city,
            addressData.state,
            addressData.zip_code,
            addressData.country,
            addressData.is_default,
            userId,
            addressId
        ]
    );
    return result.affectedRows;
};

// Delete an address
export const deleteAddress = async (userId, addressId) => {
    const [result] = await pool.query(
        'DELETE FROM user_addresses WHERE user_id = ? AND address_id = ?',
        [userId, addressId]
    );
    return result.affectedRows;
};