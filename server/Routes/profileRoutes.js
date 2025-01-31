const express = require("express");
const router = express.Router();
const { getProfile } = require("../Controllers/profileController");
const { protect } = require("../Middlewares/authMiddleware");

router.get("/", protect, getProfile);

module.exports = router;
