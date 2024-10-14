const { client } = require("./client");
const uuid = require("uuid");

const createGame = async ({ title, description, release_date, category, image_url }) => {
  const SQL = `
    INSERT INTO games(id, title, description, release_date, category, image_url) 
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    title,
    description,
    release_date,
    category,
    image_url
  ]);
  return response.rows[0];
};

const fetchGames = async () => {
  const SQL = `SELECT * FROM games`;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchGameById = async (id) => {
  const SQL = `SELECT * FROM games WHERE id = $1`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const updateGame = async (id, { title, description, release_date, category, image_url }) => {
    const SQL = `
      UPDATE games
      SET title = $1, description = $2, release_date = $3, category = $4, image_url = $5
      WHERE id = $6
      RETURNING *
    `;
    const response = await client.query(SQL, [title, description, release_date, category, image_url, id]);
    return response.rows[0];
  };
  
  const deleteGame = async (id) => {
    const SQL = `DELETE FROM games WHERE id = $1 RETURNING *`;
    const response = await client.query(SQL, [id]);
    return response.rows[0];
  };
  
  const searchGames = async (query) => {
    const SQL = `
      SELECT * FROM games
      WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
    `;
    const response = await client.query(SQL, [`%${query}%`]);
    return response.rows;
  };
  
  module.exports = { createGame, fetchGames, fetchGameById, updateGame, deleteGame, searchGames };