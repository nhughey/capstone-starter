const express = require("express");
const router = express.Router();
const { createReview, fetchReviewsByGameId } = require("../db/review");
const { isLoggedIn } = require("./utils");

router.get("/game/:gameId", async (req, res, next) => {
  try {
    const reviews = await fetchReviewsByGameId(req.params.gameId);
    res.send(reviews);
  } catch (ex) {
    next(ex);
  }
});

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

module.exports = router;