const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { client } = require("./db");

// Initialize db connection with error handling
const init = async () => {
  try {
    await client.connect();
    console.log('Connected to database');

    // Middleware
    app.use(express.json());

    // API Routes before static files
    app.use("/api", require("./api"));

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // Error handling
    app.use((err, req, res, next) => {
      console.log(err);
      res.status(err.status || 500)
         .send({ error: err.message ? err.message : err });
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Database connected and server is ready`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
init();