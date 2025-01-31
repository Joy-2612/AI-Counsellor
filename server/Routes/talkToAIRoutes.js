// routes/talkToAI.js
const express = require("express");
const { voiceConversation } = require("../Controllers/talkToAIController");
const router = express.Router();

router.post("/", voiceConversation);

module.exports = router;
