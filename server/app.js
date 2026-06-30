const {
  errorHandler,
} = require("./middleware/errorMiddleware");
const express = require("express");
const cors = require("cors");

const app = express();

const interviewRoutes = require("./routes/interviewRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.use(
  "/api/resume",
  require("./routes/resumeRoutes")
);

app.use(
  "/api/interviews",
  interviewRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(errorHandler);

module.exports = app;