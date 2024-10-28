const express = require("express");
const router = express.Router();
const { 
  createReview, 
  fetchReviewsByGameId, 
  fetchReviewsByUserId,  
  deleteReview,
  updateReview, 
  fetchReviewById,   // Add this import if not already there
  fetchReviews       // Add this import to fetch all reviews
} = require("../db/review");
const { isLoggedIn, isAdmin } = require("./utils");  // Ensure you have the isAdmin utility function

// Get reviews for a specific game
router.get("/game/:gameId", async (req, res, next) => {
  try {
    const reviews = await fetchReviewsByGameId(req.params.gameId);
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
});

// Get reviews for a specific user
router.get("/user/:userId", async (req, res, next) => {
  try {
    const reviews = await fetchReviewsByUserId(req.params.userId);
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
});

// Get all reviews (Admin only)
router.get("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const reviews = await fetchReviews();
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
});

// Create a new review
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const review = await createReview({
      user_id: req.user.id,
      game_id: req.body.game_id,
      rating: req.body.rating,
      content: req.body.content
    });
    res.send(review);
  } catch (ex) {
    next(ex);
  }
});

// Update an existing review
router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    // Check if the review belongs to the logged-in user
    const review = await fetchReviewById(req.params.id);
    if (!review || review.user_id !== req.user.id) {
      return res.status(403).send({ error: "Not authorized to edit this review" });
    }

    // Update the review with new content and rating
    const updatedReview = await updateReview(req.params.id, {
      content: req.body.content,
      rating: req.body.rating
    });
    res.send(updatedReview);
  } catch (ex) {
    next(ex);
  }
});

// Delete a review
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const review = await deleteReview(req.params.id);
    if (review.user_id !== req.user.id) {
      return res.status(403).send({ error: "Not authorized to delete this review" });
    }
    res.send(review);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
