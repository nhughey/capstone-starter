const { client } = require("./client");
const { createUser, fetchUsers } = require("./user");

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT false
    );

    CREATE TABLE games(
      id UUID PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      release_date DATE,
      category VARCHAR(50),
      image_url TEXT
    );

    CREATE TABLE reviews(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      game_id UUID REFERENCES games(id),
      content TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await client.query(SQL);
};

const createInitialData = async () => {
  const [moe, lucy, admin] = await Promise.all([
    createUser({ username: "moe", password: "m_pw" }),
    createUser({ username: "lucy", password: "l_pw" }),
    createUser({ username: "admin", password: "a_pw", is_admin: true }),
  ]);

  // Add functions to create games and reviews here
  // Example: await createGame({ title: "Super Mario Odyssey", ... })
  // Example: await createReview({ user_id: moe.id, game_id: game1.id, ... })
};

const init = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    await createInitialData();
    console.log("initial data created");
    const users = await fetchUsers();
    console.log(`${users.length} users created`);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
};

init();