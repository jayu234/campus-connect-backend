const express = require("express");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = require("./routes/userRoute");
app.use("/api/v1", users);

module.exports = app;
