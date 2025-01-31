const express = require("express");
const router = express.Router();
const {
  getRecommendations,
} = require("../Controllers/recommendationController");
const { protect } = require("../Middlewares/authMiddleware");

router.get("/", protect, getRecommendations);

module.exports = router;
