require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/db");

const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);

connectDB();

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On ${PORT}`
  );
});