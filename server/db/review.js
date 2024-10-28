const { client } = require("./client");
const uuid = require("uuid");

const createReview = async ({ user_id, game_id, content, rating }) => {
  const SQL = `
    INSERT INTO reviews(id, user_id, game_id, content, rating) 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    game_id,
    content,
    rating
  ]);
  return response.rows[0];
};

const fetchReviews = async () => {
  const SQL = `SELECT * FROM reviews`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReviewsByGameId = async (game_id) => {
  const SQL = `
    SELECT r.*, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.game_id = $1
    ORDER BY r.created_at DESC
  `;
  const response = await client.query(SQL, [game_id]);
  return response.rows;
};

const updateReview = async (id, { content, rating }) => {
  const SQL = `
    UPDATE reviews
    SET content = $1, rating = $2
    WHERE id = $3
    RETURNING *
  `;
  const response = await client.query(SQL, [content, rating, id]);
  return response.rows[0];
};

const deleteReview = async (id) => {
  const SQL = `DELETE FROM reviews WHERE id = $1 RETURNING *`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = { createReview, fetchReviews, fetchReviewsByGameId, updateReview, deleteReview };