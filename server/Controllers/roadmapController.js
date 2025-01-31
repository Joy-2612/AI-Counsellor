// This controller uses "Gemini" or any AI to generate a skill roadmap
const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateRoadmap = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    const roadmapPrompt = fs.readFileSync(
      path.join(__dirname, "..", "prompts", "roadmapPrompt.xml"),
      "utf-8"
    );

    const geminiPrompt = `
        ${roadmapPrompt}
        
        <!-- Additional instructions or placeholders if needed -->
        
        <Skill>${skill}</Skill>
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

    const roadmap = parsedResponse?.GeminiResponse || [];

    return res.json({ roadmap });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error generating roadmap" });
  }
};
