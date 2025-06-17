// backend/gemini.js
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();
require("dotenv").config();

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST route to generate content
router.post("/generate", async (req, res) => {
  const userPrompt = req.body.prompt;

  if (!userPrompt || typeof userPrompt !== "string") {
    return res
      .status(400)
      .json({ error: "Prompt is required and must be a string" });
  }

  try {
    const prompt = `
You are an AI assistant created to help students of NIT Hamirpur with their convocation-related queries.
Be concise, helpful, and polite.
Provide only relevant information. If you don’t know something, politely say so.
Here is the user's question: "${userPrompt}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    res.json({ result: response.text() });
  } catch (error) {
    console.error("Error generating content:", error.message);
    res.status(500).json({ error: "Error generating content" });
  }
});

module.exports = router;
