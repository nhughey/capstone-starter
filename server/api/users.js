const express = require("express");
const router = express.Router();

const { fetchUsers } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
