 // ====== Constants ======
const LOCAL_STORAGE_KEY = "quotes";
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // mock endpoint

// ====== Load initial quotes ======
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  return storedQuotes;
}

function saveQuotes(quotes) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// ====== Display sync status ======
function updateStatus(message, type = "info") {
  const statusDiv = document.getElementById("syncStatus");
  statusDiv.textContent = message;
  statusDiv.style.color = type === "error" ? "red" : "green";
  setTimeout(() => (statusDiv.textContent = ""), 3000);
}

// ====== Fetch from server ======
async function fetchFromServer() {
  try {
    const response = await fetch(API_URL);
    let serverQuotes = await response.json();

    // Keep only first 5 for demo (JSONPlaceholder returns too many)
    serverQuotes = serverQuotes.slice(0, 5).map(q => ({
      text: q.title,
      category: "Server",
      id: q.id
    }));

    // Conflict resolution: server wins
    saveQuotes(serverQuotes);
    updateStatus("Quotes synced from server.", "info");
    renderQuotes(serverQuotes);
  } catch (err) {
    updateStatus("Failed to fetch from server.", "error");
  }
}

// ====== Push to server ======
async function pushToServer(localQuotes) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(localQuotes),
      headers: { "Content-Type": "application/json" }
    });
    updateStatus("Local quotes synced to server.");
  } catch (err) {
    updateStatus("Failed to push to server.", "error");
  }
}

// ====== Manual sync button ======
document.getElementById("syncBtn").addEventListener("click", async () => {
  const localQuotes = loadQuotes();
  await pushToServer(localQuotes);
  await fetchFromServer();
});

// ====== Auto sync every 60 seconds ======
setInterval(fetchFromServer, 60000);

// ====== Render quotes ======
function renderQuotes(quotes) {
  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";
  quotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `${q.text} — [${q.category}]`;
    container.appendChild(p);
  });
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  renderQuotes(loadQuotes());
});
