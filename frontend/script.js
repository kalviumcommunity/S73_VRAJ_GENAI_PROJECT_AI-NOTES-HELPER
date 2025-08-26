async function processNote() {
  const note = document.getElementById("noteInput").value.trim();
  const task = document.getElementById("taskSelect").value;
  const shotMode = document.getElementById("shotSelect").value;

  try {
    const response = await fetch("http://localhost:5000/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, task, shotMode }),
    });

    const data = await response.json();

    if (data.error) {
      document.getElementById("output").innerText = `❌ Error: ${data.error}`;
      document.getElementById("tokensBox").style.display = "none";
      return;
    }

    // Show AI output
    document.getElementById("output").innerText =
      `(${(data.usedShot || "unknown").toUpperCase()} mode, ${data.wordCount || 0} words)\n\n` +
      (data.output || "No output from backend.");

    // Show tokens in the box
    if (data.tokens) {
      document.getElementById("promptTokens").innerText = `Prompt: ${data.tokens.promptTokens}`;
      document.getElementById("responseTokens").innerText = `Response: ${data.tokens.responseTokens}`;
      document.getElementById("totalTokens").innerText = `Total: ${data.tokens.totalTokens}`;
      document.getElementById("tokensBox").style.display = "block";
    } else {
      document.getElementById("tokensBox").style.display = "none";
    }

  } catch (err) {
    console.error("Frontend fetch error:", err);
    document.getElementById("output").innerText = "❌ Failed to connect to backend.";
    document.getElementById("tokensBox").style.display = "none";
  }
}
