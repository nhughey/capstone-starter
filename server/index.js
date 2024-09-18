const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const { client } = require("./db");
client.connect();

app.use(express.json());

app.use("/api", require("./api"));

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

app.listen(port, () => console.log(`listening on port ${port}`));

// const init = async () => {
//   const port = process.env.PORT || 3000;
//   await client.connect();
//   console.log("connected to database");

//   await createTables();
//   console.log("tables created");

//   const [moe, lucy, ethyl, curly] = await Promise.all([
//     createUser({ username: "moe", password: "m_pw" }),
//     createUser({ username: "lucy", password: "l_pw" }),
//     createUser({ username: "ethyl", password: "e_pw" }),
//     createUser({ username: "curly", password: "c_pw" }),
//   ]);

//   console.log(await fetchUsers());

//   app.listen(port, () => console.log(`listening on port ${port}`));
// };

// init();
