const { client } = require("./client");
const { createUser, fetchUsers } = require("./user");
const { createGame, fetchGames } = require("./game"); // Make sure this import exists

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
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
  console.log("Tables created successfully");
};

const createAdminUsers = async () => {
  try {
    console.log("Starting to create admin user...");
    const adminUser = await createUser({ 
      username: "nigel.hughey@gmail.com", 
      password: "Mindeveien79", 
      is_admin: true 
    });
    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

const createInitialData = async () => {
  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: "moe", password: "m_pw" }),
    createUser({ username: "lucy", password: "l_pw" }),
    createUser({ username: "ethyl", password: "e_pw" })
  ]);

  

  const games = await Promise.all([
    createGame({
      title: "The Legend of Zelda: Breath of the Wild",
      description: "An action-adventure game that follows an amnesiac Link as he sets out to save Princess Zelda and defeat Calamity Ganon.",
      release_date: "2017-03-03",
      category: "Action-Adventure",
      image_url: "https://example.com/botw.jpg"
    }),
    createGame({
      title: "Red Dead Redemption 2",
      description: "An epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world also provides the foundation for a brand new online multiplayer experience.",
      release_date: "2018-10-26",
      category: "Action-Adventure",
      image_url: "https://example.com/rdr2.jpg"
    }),
    createGame({
      title: "Minecraft",
      description: "A game about placing blocks and going on adventures. Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles.",
      release_date: "2011-11-18",
      category: "Sandbox",
      image_url: "https://example.com/minecraft.jpg"
    })
  ]);

  console.log("Games created:", games);
};

const init = async () => {
  try {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    await createInitialData();
    console.log("initial data created");
    await createAdminUsers();
    console.log("admin users created");
    const users = await fetchUsers();
    console.log(`${users.length} users created`);
    const games = await fetchGames();
    console.log(`${games.length} games created`);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
};

init();