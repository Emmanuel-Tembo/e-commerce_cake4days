// controllers/userAddressController.js
import * as userAddressModel from '../model/userAddressModel.js';

export const getUserAddresses = async (req, res) => {
    const userId = req.user.userId;
    try {
        const addresses = await userAddressModel.getAddressesByUserId(userId);
        res.status(200).json(addresses);
    } catch (e) {
        console.error('Error fetching user addresses:', e);
        res.status(500).json({ message: 'Server error fetching addresses.' });
    }
};

export const addUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const addressData = req.body;
    try {
        const addressId = await userAddressModel.addAddress(userId, addressData);
        res.status(201).json({ message: 'Address added successfully!', addressId });
    } catch (e) {
        console.error('Error adding user address:', e);
        res.status(500).json({ message: 'Server error adding address.' });
    }
};

export const updateUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const addressData = req.body;
    try {
        const affectedRows = await userAddressModel.updateAddress(userId, addressId, addressData);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Address updated successfully!' });
        } else {
            res.status(404).json({ message: 'Address not found or no changes were made.' });
        }
    } catch (e) {
        console.error('Error updating user address:', e);
        res.status(500).json({ message: 'Server error updating address.' });
    }
};

export const deleteUserAddress = async (req, res) => {
    const userId = req.user.userId;
    const { addressId } = req.params;
    try {
        const affectedRows = await userAddressModel.deleteAddress(userId, addressId);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Address deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Address not found or already deleted.' });
        }
    } catch (e) {
        console.error('Error deleting user address:', e);
        res.status(500).json({ message: 'Server error deleting address.' });
    }
};