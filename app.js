const express = require("express");
const app = express();
const cookieparser =require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieparser());

const users = require("./routes/userRoutes");
const posts = require("./routes/postRoutes");
const doubts = require("./routes/doubtRoutes");
const answers = require("./routes/answerRoutes");
// const utils = require("./routes/utilsRoutes");
const errorMiddleware = require("./middleware/error");

app.use("/api/v1", users);
app.use("/api/v1", posts);
app.use("/api/v1", doubts);
app.use("/api/v1", answers);
// app.use("/api/v1", utils);
app.use(errorMiddleware);
module.exports = app;
