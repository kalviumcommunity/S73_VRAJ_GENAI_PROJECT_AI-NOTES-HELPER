# 📘 AI Notes Helper (Gemini Version)

This is a **basic AI project** built with the **Google Gemini API**.  
The goal is simple → show how different **prompting + AI concepts** work using notes.  
Each feature is kept **very basic** and is implemented in a **separate branch**.

---

## 🔎 About the Project

- **Frontend:** plain HTML, CSS, JS (basic UI)  
- **Backend:** Node.js + Express  
- **AI Model:** Google Gemini API  
- Each branch has **one feature** → easy to test and learn  
- This project is for **learning + demo only**, not production  

---

## ⚡ Features (7 Concepts)

Each point is done in its own **branch**.

---

### 1️⃣ System + User Prompt
- **Branch:** `feature/system-user-prompt`  
- Example of using both **system** (instructions for model behavior) + **user input**.  
- Example:  
  - System: "You are a notes helper. Always explain simply."  
  - User: "Explain photosynthesis."  
  → Output: "Plants make food using sunlight, water, and air."

---

### 2️⃣ Zero-Shot Prompting
- **Branch:** `feature/zero-shot`  
- Directly ask Gemini without any examples.  
- Example:  
  > "Summarize this note in 2 lines: <note_text>"

---

### 3️⃣ One-Shot Prompting
- **Branch:** `feature/one-shot`  
- Give **one example** to guide the model.  
- Example:  
  > Example: "Photosynthesis → Plants make their own food."  
  Now do the same for this note: <note_text>

---

### 4️⃣ Multi-Shot Prompting
- **Branch:** `feature/multi-shot`  
- Give **multiple examples** for better learning.  
- Example:  
  > Example 1: "Newton’s Law → Objects keep moving unless stopped."  
  > Example 2: "Photosynthesis → Plants make food using sunlight."  
  Now explain: <note_text>

---

### 5️⃣ Dynamic Prompting
- **Branch:** `feature/dynamic-prompt`  
- Prompt changes based on **input length**.  
- If text is short → "Explain in detail."  
- If text is long → "Summarize in 3 lines."

---

### 6️⃣ Embeddings
- **Branch:** `feature/embeddings`  
- Convert notes into **vectors** using embeddings.  
- Store them for later use.  
- Example: "Save vector form of ‘Photosynthesis’ note."

---

### 7️⃣ Cosine Similarity (Search)
- **Branch:** `feature/cosine-similarity`  
- Use cosine similarity to find **closest matching note** to the query.  
- Example:  
  - Query: "What is Newton’s Law?"  
  - System finds the most similar note from stored embeddings.  
  - Sends it to Gemini for explanation.  


---
## 📝 Conclusion

This project is not about building a big app.  
It is just to **learn the 7 basic AI concepts** step by step:  
- how prompting works,  
- how examples guide the model,  
- how embeddings + similarity can make search smarter.  

By checking each branch, you can **see the difference directly**.  
It’s a clean, simple way to understand how to work with Gemini API for real projects later.  
---

