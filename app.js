const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const config = require("./utils/variables");

app.use(cors());
const users = require("./routes/users");

// Connect To Database
mongoose.connect(config.database.name);

// On Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + config.database.name);
});

// On Error
mongoose.connection.on("error", err => {
  console.log("Database error:\n" + err);
});

const port = process.env.PORT || config.port;
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// passport jwt sratagy
require("./utils/passport")(passport);

// Directing Routes
app.use("/users", users);

// Index Route
app.get("/", (req, res) => {
  res.send("Web server not started");
});

// Start Server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
