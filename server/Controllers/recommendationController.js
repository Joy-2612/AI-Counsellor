const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { User } = require("../Models/User");

exports.getRecommendations = async (req, res) => {
  try {
    // In real usage, call Gemini or any AI with user's profile details
    // const aiResponse = await geminiAPI.getRecommendations(req.user.profile);

    const userId = req.user;
    const user = await User.findById(userId);

    const bio = user.bio;
    const qualifications = user.qualifications;
    const goals = user.goal;

    const recommendationPrompt = fs.readFileSync(
      path.join(__dirname, "..", "prompts", "recommendationsPrompt.xml"),
      "utf-8"
    );

    const geminiPrompt = `
        ${recommendationPrompt}

        <!-- Additional instructions or placeholders if needed -->

        <Bio>${bio}</Bio>
        <Qualifications>${qualifications}</Qualifications>
        <Goals>${goals}</Goals>

        `;
    const gemini_api_key = process.env.GEMINI_API_KEY;
    const googleAI = new GoogleGenerativeAI(gemini_api_key);
    const geminiModel = googleAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const geminiResult = await geminiModel.generateContent(geminiPrompt);

    const responseText = geminiResult.response?.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    parsedResponse = parser.parse(responseText);
    const recommendations =
      parsedResponse?.GeminiResponse?.recommendations || [];

    return res.json({ recommendations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching recommendations" });
  }
};
