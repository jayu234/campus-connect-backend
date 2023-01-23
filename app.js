const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const users = require("./routes/userRoutes");
const posts = require("./routes/postRoutes");
const doubts = require("./routes/doubtRoutes");
const answers = require("./routes/answerRoutes");
const utils = require("./routes/utilsRoutes");

app.use("/api/v1", users);
// app.use("/api/v1", posts);
// app.use("/api/v1", doubts);
// app.use("/api/v1", answers);
// app.use("/api/v1", utils);

module.exports = app;
