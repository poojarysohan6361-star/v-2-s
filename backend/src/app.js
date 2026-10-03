const express = require("express");
const cors = require("cors");
const moveRoutes = require("./routes/move.routes");
const answerRoutes = require("./routes/answer.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const adminRoutes = require("./routes/admin.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/move", moveRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
