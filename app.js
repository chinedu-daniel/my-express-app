const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error.middleware");

app.use(express.json());

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

app.use(errorMiddleware);

// app.use(errorHandler);

module.exports = app;