const fs = require("fs");
const path = require("path");
const { User } = require("../Models/User");
const { XMLParser } = require("fast-xml-parser");

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.submitTest = async (req, res) => {
  try {
    const { userId, questions, answers } = req.body;
    console.log("User ID:", userId);
    console.log("Questions:", questions);
    console.log("Answers:", answers);

    const testPrompt = fs.readFileSync(
      path.join(__dirname, "..", "prompts", "testPrompt.xml"),
      "utf-8"
    );

    const geminiPrompt = `
      ${testPrompt}
      
      <!-- Additional instructions or placeholders if needed -->
      
      <UserInput>
        <Questions>
          ${questions
            .map((q, idx) => `<Question index="${idx}">${q}</Question>`)
            .join("\n")}
        </Questions>
        <Answers>
          ${Object.entries(answers)
            .map(([idx, ans]) => `<Answer index="${idx}">${ans}</Answer>`)
            .join("\n")}
        </Answers>
      </UserInput>
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

    const qualifications = parsedResponse?.GeminiResponse?.Qualifications || "";
    const bio = parsedResponse?.GeminiResponse?.Bio || "";
    const goal = parsedResponse?.GeminiResponse?.Goals || "";
    const hobbies = parsedResponse?.GeminiResponse?.Hobbies || "";
    const location = parsedResponse?.GeminiResponse?.Location || "";

    console.log("UserId : ", userId);
    if (!userId) {
      return res.status(400).json({ message: "No user ID provided." });
    }

    console.log("Updating user profile...");
    const updatedUser = await User.findByIdAndUpdate(userId, {
      qualifications,
      bio,
      goal,
      location,
      hobbies,
    });

    if (!updatedUser) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile updated successfully from Gemini analysis.",
      analysis: {
        qualifications,
        bio,
        goal,
        location,
        hobbies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing test" });
  }
};
