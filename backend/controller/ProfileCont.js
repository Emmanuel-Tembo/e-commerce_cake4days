// src/controller/ProfileCont.js
import * as profileModel from '../model/profileModel.js';

export const getProfile = async (req, res) => {
    // Check if the user object was successfully attached by the middleware
    if (!req.user || !req.user.user_id) {
        console.error('Error: User object missing from request. Token verification failed.');
        return res.status(401).json({ msg: 'Authentication failed: User data not found in token.' });
    }
    
    const { user_id, role } = req.user; 
    console.log(`Attempting to fetch profile for user_id: ${user_id} with role: ${role}`); // Log for debugging

    try {
        let profileDetails;
        if (role === 'admin') {
            profileDetails = await profileModel.getAdminProfile(user_id);
        } else {
            profileDetails = await profileModel.getUserProfile(user_id);
        }

        // Check if the database query returned a result
        if (!profileDetails) {
            console.warn(`Profile not found for user_id: ${user_id}.`);
            return res.status(404).json({ msg: 'Profile not found' });
        }

        // The query was successful, so send the data
        console.log(`Successfully fetched profile for user_id: ${user_id}.`);
        res.json(profileDetails);
    } catch (err) {
        // Log the full error to see the stack trace and pinpoint the problem
        console.error('A database error occurred while fetching profile:', err);
        
        // Differentiate between known and unknown errors
        if (err.code && err.sqlMessage) {
            // This is a MySQL-specific error
            res.status(500).json({ 
                msg: 'Database error', 
                error: err.sqlMessage, 
                errorCode: err.code 
            });
        } else {
            // This is a generic server error
            res.status(500).json({ 
                msg: 'Server Error', 
                error: err.message || 'An unknown error occurred' 
            });
        }
    }
};