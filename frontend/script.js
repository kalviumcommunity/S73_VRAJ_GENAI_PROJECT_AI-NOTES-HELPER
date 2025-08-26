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
      return;
    }

    document.getElementById("output").innerText =
      `(${(data.usedShot || "unknown").toUpperCase()} mode, ${data.wordCount || 0} words)\n\n` +
      (data.output || "No output from backend.");
  } catch (err) {
    console.error("Frontend fetch error:", err);
    document.getElementById("output").innerText =
      "❌ Failed to connect to backend.";
  }
}
