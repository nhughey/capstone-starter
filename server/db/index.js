module.exports = {
  ...require("./user.js"),
  ...require("./client.js"),
  ...require("./game.js"),
  ...require("./review.js"),
  fetchAllUsersWithReviewCount: require("./user.js").fetchAllUsersWithReviewCount
};