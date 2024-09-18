const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("./utils");
const { authenticate, createUser, findUserWithToken } = require("../db");

router.get("/", (req, res) => {
  res.send("hello from auth");
});

router.post("/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

router.get("/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
