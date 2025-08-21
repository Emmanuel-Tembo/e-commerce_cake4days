// src/controller/ProfileCont.js
import * as profileModel from '../model/profileModel.js';

export const getProfile = async (req, res) => {
    // Check if the user object was successfully attached by the middleware
    if (!req.user || !req.user.userId) { // Corrected check
        console.error('Error: User object missing from request. Token verification failed.');
        return res.status(401).json({ msg: 'Authentication failed: User data not found in token.' });
    }
    
    // Corrected variable name
    const { userId, role } = req.user; 
    console.log(`Attempting to fetch profile for userId: ${userId} with role: ${role}`); 

    try {
        let profileDetails;
        if (role === 'admin') {
            profileDetails = await profileModel.getAdminProfile(userId);
        } else {
            profileDetails = await profileModel.getUserProfile(userId);
        }

        if (!profileDetails) {
            console.warn(`Profile not found for userId: ${userId}.`);
            return res.status(404).json({ msg: 'Profile not found' });
        }

        console.log(`Successfully fetched profile for userId: ${userId}.`);
        res.json(profileDetails);
    } catch (err) {
        console.error('A database error occurred while fetching profile:', err);
        
        if (err.code && err.sqlMessage) {
            res.status(500).json({ 
                msg: 'Database error', 
                error: err.sqlMessage, 
                errorCode: err.code 
            });
        } else {
            res.status(500).json({ 
                msg: 'Server Error', 
                error: err.message || 'An unknown error occurred' 
            });
        }
    }
};