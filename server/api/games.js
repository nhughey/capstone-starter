const express = require("express");
const router = express.Router();
const { fetchGames, fetchGameById, createGame, updateGame, deleteGame, searchGames, fetchGamesByCategory } = require("../db");
const { isLoggedIn, isAdmin } = require("./utils");

// Get all games
router.get("/", async (req, res, next) => {
  try {
    res.send(await fetchGames());
  } catch (ex) {
    next(ex);
  }
});

// Get games by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    const games = await fetchGamesByCategory(category); // Function to fetch games by category
    res.send(games);
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

// Update a game (admin only)
router.put("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const updatedGame = await updateGame(req.params.id, req.body);
    res.send(updatedGame);
  } catch (ex) {
    next(ex);
  }
});

// Delete a game (admin only)
router.delete("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const deletedGame = await deleteGame(req.params.id);
    res.send(deletedGame);
  } catch (ex) {
    next(ex);
  }
});

// Search for games
router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).send({ error: "Search query is required" });
    }
    res.send(await searchGames(query));
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
