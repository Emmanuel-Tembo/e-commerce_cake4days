import * as reviewModel from '../model/reviewModel.js';

// Get reviews for a product
export const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    try {
        const reviews = await reviewModel.getReviewsByProductId(productId);
        res.status(200).json(reviews);
    } catch (e) {
        console.error('Error fetching product reviews:', e);
        res.status(500).json({ message: 'Server error fetching product reviews.' });
    }
};

// Create a new review
export const createReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.user.userId;

    if (!rating || !reviewText) {
        return res.status(400).json({ message: 'Rating and review text are required.' });
    }

    try {
        const reviewId = await reviewModel.createReview(userId, productId, rating, reviewText);
        res.status(201).json({ message: 'Review created successfully!', reviewId });
    } catch (e) {
        console.error('Error creating review:', e);
        res.status(500).json({ message: 'Server error creating review.' });
    }
};

// Delete a review (User or Admin)
export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    try {
        const review = await reviewModel.getReviewById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        // Only the owner of the review or an admin can delete it
        if (review.user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own reviews.' });
        }

        const affectedRows = await reviewModel.deleteReview(reviewId);
        if (affectedRows > 0) {
            res.status(200).json({ message: 'Review deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Review not found.' });
        }
    } catch (e) {
        console.error('Error deleting review:', e);
        res.status(500).json({ message: 'Server error deleting review.' });
    }
};