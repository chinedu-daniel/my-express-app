const express = require("express");

const authRoutes = require("./routes/authRoutes");
// const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());

app.use("/users", authRoutes);

// app.use(errorHandler);

module.exports = app;