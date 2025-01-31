const express = require("express");
const router = express.Router();
const { submitTest } = require("../Controllers/testController");
const { protect } = require("../Middlewares/authMiddleware");

// Submit user test
router.post("/submit", protect, submitTest);

module.exports = router;
