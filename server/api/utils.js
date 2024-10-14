const { findUserWithToken } = require("../db");

const isLoggedIn = async (req, res, next) => {
  try {
    const user = await findUserWithToken(req.headers.authorization);
    req.user = user;
    next();
  } catch (ex) {
    next(ex);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).send({ error: "Admin access required" });
  }
};

module.exports = { isLoggedIn, isAdmin };
