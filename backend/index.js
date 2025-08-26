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

/**
 * Build prompt dynamically based on task and shot mode.
 */
function buildPrompt(note, task, shotMode = "zero") {
  let userPrompt = "";

  // ---------- TASK OPTIONS ----------
  if (task === "explain") userPrompt = `Explain this note: "${note}"`;
  if (task === "summarize") userPrompt = `Summarize this note in 2 lines: "${note}"`;
  if (task === "bullets") userPrompt = `Convert this note into clear bullet points: "${note}"`;
  if (task === "translate") userPrompt = `Translate this note to Hindi: "${note}"`;
  if (task === "short") userPrompt = `Rewrite this note in 1 short sentence: "${note}"`;

  // ---------- SHOT MODES ----------
  if (shotMode === "zero") {
    return `
System: ${SYSTEM_PROMPT}
User: ${userPrompt}
`;
  }

  // 🔴 Future scope (not implemented yet) → "one", "few", "multi"
  // if (shotMode === "one") { ... add one example ... }
  // if (shotMode === "few") { ... add few examples ... }
  // if (shotMode === "multi") { ... add multiple examples ... }

  return `
System: ${SYSTEM_PROMPT}
User: ${userPrompt}
`; // fallback → zero-shot
}

app.post("/api/process", async (req, res) => {
  try {
    const { note, task, shotMode } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = buildPrompt(note, task, shotMode);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ output: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});