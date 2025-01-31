const express = require("express");
const motivationController = require("../Controllers/motivationController");

const router = express.Router();

// Route to get all motivational quotes
router.get("/generate", motivationController.getMotivation);

module.exports = router;
