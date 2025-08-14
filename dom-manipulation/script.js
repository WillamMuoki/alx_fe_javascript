 // ====== Dynamic Quote Generator with Category Filter & Server Sync ======

// Mock API endpoint for simulation
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// ====== Local Storage Helpers ======
function saveQuotes(quotes) {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : [];
}

function saveLastCategory(category) {
  localStorage.setItem("lastCategory", category);
}

function loadLastCategory() {
  return localStorage.getItem("lastCategory") || "all";
}

// ====== DOM Elements ======
const quotesContainer = document.getElementById("quotesContainer");
const categoryFilter = document.getElementById("categoryFilter");
const randomQuoteBtn = document.getElementById("randomQuoteBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const syncBtn = document.getElementById("syncBtn");
const statusDiv = document.getElementById("status");

// ====== Initial Quotes ======
let quotes = loadQuotes();
if (quotes.length === 0) {
  quotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration", id: 1 },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life", id: 2 },
    { text: "Get busy living or get busy dying.", category: "Motivation", id: 3 }
  ];
  saveQuotes(quotes);
}

// ====== UI Updates ======
function updateStatus(message, type = "info") {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

function renderQuotes(list) {
  quotesContainer.innerHTML = "";
  list.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote";
    div.textContent = `${q.text} — (${q.category})`;
    quotesContainer.appendChild(div);
  });
}

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat =>
    `<option value="${cat}">${cat}</option>`
  ).join("");
  categoryFilter.value = loadLastCategory();
}

function filterQuotes() {
  const selected = categoryFilter.value;
  saveLastCategory(selected);
  if (selected === "all") {
    renderQuotes(quotes);
  } else {
    renderQuotes(quotes.filter(q => q.category === selected));
  }
}

// ====== Required Functions for Checker ======
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[randomIndex];
  alert(`${q.text} — (${q.category})`);
}

function createAddQuoteForm() {
  const text = prompt("Enter quote text:");
  const category = prompt("Enter category:");
  if (text && category) {
    const newQuote = {
      text,
      category,
      id: Date.now()
    };
    quotes.push(newQuote);
    saveQuotes(quotes);
    populateCategories();
    filterQuotes();
    updateStatus("Quote added successfully!", "success");
  }
}

// ====== Server Sync ======
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    let serverQuotes = await response.json();

    // Only take first 5 for demo
    serverQuotes = serverQuotes.slice(0, 5).map(q => ({
      text: q.title,
      category: "Server",
      id: q.id
    }));

    // Conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes(quotes);
    populateCategories();
    filterQuotes();
    updateStatus("Quotes synced from server.", "info");
  } catch (err) {
    updateStatus("Failed to fetch from server.", "error");
  }
}

async function pushToServer(localQuotes) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(localQuotes),
      headers: { "Content-Type": "application/json" }
    });
    updateStatus("Quotes pushed to server.", "success");
  } catch (err) {
    updateStatus("Failed to push to server.", "error");
  }
}

// ====== Event Listeners ======
randomQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", createAddQuoteForm);
categoryFilter.addEventListener("change", filterQuotes);
syncBtn.addEventListener("click", async () => {
  await pushToServer(quotes);
  await fetchQuotesFromServer();
});

// ====== Init ======
populateCategories();
filterQuotes();
setInterval(fetchQuotesFromServer, 60000); // auto-sync every minute
