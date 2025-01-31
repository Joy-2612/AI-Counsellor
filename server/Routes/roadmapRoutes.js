const express = require("express");
const router = express.Router();
const { generateRoadmap } = require("../Controllers/roadmapController");
const { protect } = require("../Middlewares/authMiddleware");

router.post("/generate", protect, generateRoadmap);

module.exports = router;
