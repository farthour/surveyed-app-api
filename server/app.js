require("dotenv").config();
const express = require("express");
const app = express();

// Middlewares
require("./startup/logging")();
require("./startup/middlewares").networkMiddleware(app);
require("./startup/routes")(app);
require("./startup/db")();

// Port config
const port = process.env.PORT || 7000;

// Listen to the port
app.listen(port, () => console.log(`Listening on port ${port}...`));
