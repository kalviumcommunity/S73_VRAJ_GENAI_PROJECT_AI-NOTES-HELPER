import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt
const SYSTEM_PROMPT = `
You are an AI Notes Helper.
- Always explain notes in simple language (student-friendly).
- Keep answers short (2–3 sentences).
- If input is too long, give a summary instead of full detail.
`;

app.post("/api/process", async (req, res) => {
  try {
    const { note } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
System: ${SYSTEM_PROMPT}
User: Explain this note: "${note}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ output: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
