require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./Routes/authRoutes");
const testRoutes = require("./Routes/testRoutes");
const profileRoutes = require("./Routes/profileRoutes");
const roadmapRoutes = require("./Routes/roadmapRoutes");
const referralRoutes = require("./Routes/referralRoutes");
const recommendationRoutes = require("./Routes/recommendationRoutes");
const motivationRoutes = require("./Routes/motivationRoutes");
const talkToAIRoutes = require("./Routes/talkToAIRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/test", testRoutes);
app.use("/profile", profileRoutes);
app.use("/roadmap", roadmapRoutes);
app.use("/referrals", referralRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/motivation", motivationRoutes);
app.use("/talktoai", talkToAIRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
