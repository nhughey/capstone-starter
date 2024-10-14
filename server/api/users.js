const express = require("express");
const router = express.Router();

const { fetchUsers, fetchUserById, updateUser } = require("../db");
const { isLoggedIn } = require("./utils");

router.get("/", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.send(await fetchUserById(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

router.put("/:id", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).send({ error: "Not authorized to update this profile" });
    }
    res.send(await updateUser(req.params.id, req.body));
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;