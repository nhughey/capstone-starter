const express = require("express");
const router = express.Router();

const { fetchUsers, fetchUserById, updateUser, fetchAllUsersWithReviewCount } = require("../db");
const { isLoggedIn } = require("./utils");

// Get all users (without review counts)
router.get("/", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (ex) {
    next(ex);
  }
});

// Get all users with review counts
router.get("/withReviewCount", async (req, res, next) => {
  try {
    const users = await fetchAllUsersWithReviewCount();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

// Get a specific user by ID
router.get("/:id", async (req, res, next) => {
  try {
    const user = await fetchUserById(req.params.id);
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

// Update a specific user (only allowed for the logged-in user)
router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).send({ error: "Not authorized to update this profile" });
    }
    const updatedUser = await updateUser(req.params.id, req.body);
    res.send(updatedUser);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
