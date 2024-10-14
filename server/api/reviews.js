
const express = require("express");
const router = express.Router();
const { fetchGames, fetchGameById, createGame } = require("../db");
const { isLoggedIn, isAdmin } = require("./utils");

// Get all games
router.get("/", async (req, res, next) => {
  try {
    res.send(await fetchGames());
  } catch (ex) {
    next(ex);
  }
});

// Get a specific game
router.get("/:id", async (req, res, next) => {
  try {
    const game = await fetchGameById(req.params.id);
    if (game) {
      res.send(game);
    } else {
      res.status(404).send({ error: "Game not found" });
    }
  } catch (ex) {
    next(ex);
  }
});

// Create a new game (admin only)
router.post("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    res.status(201).send(await createGame(req.body));
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;