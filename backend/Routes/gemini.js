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
Provide only relevant information. If you don’t know something, politely say so. The venue is the Hall of the Institute and the date is
15th of July, 2025. Girls have to wear some ethinic in white color and for boys, it is white shirt and black pant.If you have any problem
related to payment issue in the portal, contact admin office.If you have paid the money but the portal is not announcing it, contact the admin office.
Also , the convocation is for the students of 2021-2025 batch. The contact of the Admin office is 01972-223-000.
 Always keep answers in context of convocation only. Don’t hallucinate or answer non-related academic or personal queries.
 If the question is out of scope (e.g. admissions, hostel, marks), politely redirect to the concerned department.
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
