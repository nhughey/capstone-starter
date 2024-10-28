const { client } = require("./client");

const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";
if (JWT === "shhh") {
  console.log("If deployed, set process.env.JWT to something other than shhh");
}

const createUser = async ({ username, password, is_admin = false }) => {
  if (!username || !password) {
    const error = Error("username and password required!");
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO users(id, username, password, is_admin) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
    is_admin
  ]);
  return response.rows[0];
};

const findUserWithToken = async (token) => {
  if (!token) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  try {
    const payload = await jwt.verify(token.replace('Bearer ', ''), JWT);
    const SQL = `
      SELECT id, username, is_admin FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [payload.id]);
    if (!response.rows.length) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username, is_admin FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, username, password, is_admin FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  return { 
    token,
    user: {
      id: response.rows[0].id,
      username: response.rows[0].username,
      is_admin: response.rows[0].is_admin
    }
  };
};

const fetchUserById = async (id) => {
  const SQL = `SELECT id, username FROM users WHERE id = $1`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const updateUser = async (id, { username }) => {
  const SQL = `UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username`;
  const response = await client.query(SQL, [username, id]);
  return response.rows[0];
};

module.exports = { 
  createUser, 
  findUserWithToken, 
  fetchUsers, 
  authenticate, 
  fetchUserById, 
  updateUser 
};
