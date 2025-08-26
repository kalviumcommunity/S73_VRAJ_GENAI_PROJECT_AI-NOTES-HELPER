import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encoding_for_model } from "@dqbd/tiktoken"; // token counting

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

// ---------------- Build prompt dynamically ----------------
function buildPrompt(note, task, shotMode = "zero") {
  const wordCount = note.split(/\s+/).length;
  let userPrompt = "";

  let dynamicSystemPrompt = `
You are an AI Notes Helper.
- Always explain notes in simple, student-friendly language.
`;

  if (task === "cot") {
    dynamicSystemPrompt += `
- Use Chain of Thought reasoning: think aloud step by step before giving the final answer.
- Clearly separate each reasoning step.
- At the end, provide a concise summary or conclusion.
- If applicable, use examples to illustrate each step.
`;
    userPrompt = `Note: "${note}"
Explain this note step by step with reasoning (think aloud), then give a concise conclusion.`;
  } else if (task === "explain") {
    if (wordCount <= ONE_LIMIT) {
      userPrompt = `Explain this note in detail: "${note}"`;
    } else {
      userPrompt = `Summarize this note in 3 lines: "${note}"`;
    }
  } else if (task === "summarize") userPrompt = `Summarize this note in 2 lines: "${note}"`;
  else if (task === "bullets") userPrompt = `Convert this note into clear bullet points: "${note}"`;
  else if (task === "translate") userPrompt = `Translate this note to Hindi: "${note}"`;
  else if (task === "short") userPrompt = `Rewrite this note in 1 short sentence: "${note}"`;

  let examples = "";
  if (shotMode === "one") {
    examples = `
Example:
Note: "Photosynthesis"
Output: "Plants make their own food."
`;
  } else if (shotMode === "multi") {
    examples = `
Example 1:
Note: "Gravity"
Output: "Objects are pulled towards Earth."

Example 2:
Note: "Evaporation"
Output: "Water turns into vapor when heated."
`;
  }

  return `System: ${dynamicSystemPrompt}${examples}\nUser: ${userPrompt}`;
}

// ---------------- Process Note Endpoint with Token Logging ----------------
app.post("/api/process", async (req, res) => {
  try {
    const { note, task, shotMode } = req.body;
    if (!note || !task) return res.status(400).json({ error: "Note and task are required." });

    let finalShotMode = shotMode || "auto";
    const wordCount = note.split(/\s+/).length;
    if (finalShotMode === "auto") {
      if (wordCount <= ZERO_LIMIT) finalShotMode = "zero";
      else if (wordCount <= ONE_LIMIT) finalShotMode = "one";
      else finalShotMode = "multi";
    }

    const prompt = buildPrompt(note, task, finalShotMode);

    // ---------------- Generate AI Content ----------------
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const aiResult = await model.generateContent(prompt);
    const text = aiResult?.response?.text ? aiResult.response.text() : "No response from model.";

    // ---------------- Token Counting ----------------
    const enc = encoding_for_model("gpt-4"); // approximate token counting
    const promptTokens = enc.encode(prompt).length;
    const responseTokens = enc.encode(text).length;
    const totalTokens = promptTokens + responseTokens;

    console.log(`🟢 Token Usage: Prompt = ${promptTokens}, Response = ${responseTokens}, Total = ${totalTokens}`);

    res.json({
      output: text,
      usedShot: finalShotMode,
      wordCount,
      tokens: {
        promptTokens,
        responseTokens,
        totalTokens
      }
    });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
