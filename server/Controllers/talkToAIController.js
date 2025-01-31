// controllers/talkToAI.controller.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { User } = require("../Models/User");

exports.voiceConversation = async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    const userMessage = req.body.message;

    console.log("User:", user);
    // Construct conversational prompt
    const conversationPrompt = `
      You are a friendly motivational coach having a voice conversation with ${user.name}. 
      Keep responses concise (only 1 small sentence) and spoken-language friendly and emotional.
      
      User Profile:
      - Bio: ${user.bio}
      - Qualifications: ${user.qualifications}
      - Goals: ${user.goal}
      
      Current Message: "${userMessage}"
      
      Note : Generate very concised responses not exceeding 1 line each.
      Respond naturally as if in a real conversation. Focus on:
      - Asking clarifying questions
      - try to understand the user's feelings
      - Providing actionable advice
      - Offering encouragement
      - Suggesting next steps
    `;

    const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = googleAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 150, // Keep responses short for voice
        temperature: 0.7, // Balance creativity and focus
      },
    });

    const result = await model.generateContent(conversationPrompt);
    const responseText = await result.response.text();

    res.json({
      reply: responseText,
    });
  } catch (error) {
    console.error("Voice Conversation Error:", error);
    res.status(500).json({
      reply:
        "I'm having trouble responding right now. Could you please repeat that?",
    });
  }
};
