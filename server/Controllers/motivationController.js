const fs = require("fs");
const path = require("path");
const { XMLParser } = require("fast-xml-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getMotivation = async (req, res) => {
  try {
    const motivationPrompt = fs.readFileSync(
      path.join(__dirname, "..", "prompts", "motivationPrompt.xml"),
      "utf-8"
    );

    const geminiPrompt = `
        ${motivationPrompt}
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
    const motivation = parsedResponse?.GeminiResponse?.motivation || [];

    return res.json({ motivation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching recommendations" });
  }
};
