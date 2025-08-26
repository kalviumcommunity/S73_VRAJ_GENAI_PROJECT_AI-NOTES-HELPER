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

// Configurable thresholds
const ZERO_LIMIT = parseInt(process.env.ZERO_LIMIT || "30", 10);
const ONE_LIMIT = parseInt(process.env.ONE_LIMIT || "80", 10);

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
    return `System: ${SYSTEM_PROMPT}\nUser: ${userPrompt}`;
  }

  if (shotMode === "one") {
    const oneShotExample = `
Example:
Note: "Photosynthesis"
Output: "Plants make their own food."
`;
    return `System: ${SYSTEM_PROMPT}${oneShotExample}\nUser: ${userPrompt}`;
  }



  return `System: ${SYSTEM_PROMPT}\nUser: ${userPrompt}`;
}

app.post("/api/process", async (req, res) => {
  try {
    let { note, task, shotMode } = req.body;

    // Validate input
    if (!note || !task) {
      return res.status(400).json({ error: "Note and task are required." });
    }

    // Auto-decide shot mode if not provided or set to "auto"
    if (!shotMode || shotMode === "auto") {
      const wordCount = note.split(/\s+/).length;
      if (wordCount <= ZERO_LIMIT) shotMode = "zero";
      else if (wordCount <= ONE_LIMIT) shotMode = "one";
      else shotMode = "multi";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildPrompt(note, task, shotMode);

    const result = await model.generateContent(prompt);
    const text = result?.response?.text ? result.response.text() : "No response from model.";

    res.json({
      output: text,
      usedShot: shotMode,
      wordCount: note.split(/\s+/).length
    });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
