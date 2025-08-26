async function processNote() {
  const note = document.getElementById("noteInput").value;

  const response = await fetch("http://localhost:5000/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });

  const data = await response.json();
  document.getElementById("output").innerText = data.output;
}
