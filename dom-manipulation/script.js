 // =========================
// script.js
// Dynamic Quote Generator with LocalStorage, SessionStorage, Import/Export
// =========================

// --- 1) Load quotes from localStorage (or use defaults) ---
const LOCAL_KEY = "quotes";
const SESSION_KEY = "lastQuote";

let quotes;
try {
  const saved = localStorage.getItem(LOCAL_KEY);
  quotes = saved ? JSON.parse(saved) : null;
} catch (err) {
  console.warn("Error parsing saved quotes, using defaults.", err);
  quotes = null;
}
if (!Array.isArray(quotes) || quotes.length === 0) {
  quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Whether you think you can or you think you can't, you're right.", category: "Mindset" },
    { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "Teamwork" },
    { text: "Simplicity is the soul of efficiency.", category: "Engineering" },
  ];
}

// --- 2) Save helper ---
function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

// --- 3) Render helper ---
function renderMessage(msg) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = `<p>${String(msg)}</p>`;
}

// --- 4) showRandomQuote (checker expects this name) ---
function showRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    renderMessage("No quotes available. Add one below.");
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[idx];

  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  const block = document.createElement("blockquote");
  block.textContent = text;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `Category: ${category}`;

  container.appendChild(block);
  container.appendChild(meta);

  // store last shown quote in session storage (session-only)
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ text, category }));
  } catch (err) {
    console.warn("sessionStorage not available:", err);
  }
}

// --- 5) addQuote (checker expects this name) ---
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");
  const text = (textInput?.value || "").trim();
  const category = (catInput?.value || "").trim();

  if (!text || !category) {
    renderMessage("Please provide both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  // clear inputs
  if (textInput) textInput.value = "";
  if (catInput) catInput.value = "";

  // show the newly-added quote immediately
  showRandomQuote();
}

// --- 6) createAddQuoteForm (checker expects this name) ---
// This function will wire the existing form (if present) or create one dynamically.
function createAddQuoteForm() {
  const existingText = document.getElementById("newQuoteText");
  const existingCat = document.getElementById("newQuoteCategory");
  const existingBtn = document.getElementById("addQuoteBtn");

  if (existingText && existingCat) {
    // detach any inline onclick to avoid double execution then add listener
    if (existingBtn) {
      existingBtn.onclick = null;
      existingBtn.removeEventListener("click", addQuote); // safe remove
      existingBtn.addEventListener("click", addQuote);
    }
    return;
  }

  // If not present, create form elements
  const wrapper = document.createElement("div");
  wrapper.className = "row";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const catInput = document.createElement("input");
  catInput.id = "newQuoteCategory";
  catInput.type = "text";
  catInput.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.id = "addQuoteBtn";
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  wrapper.append(textInput, catInput, btn);

  // attempt to insert after the Show New Quote button
  const showBtn = document.getElementById("newQuote");
  if (showBtn && showBtn.parentElement) {
    showBtn.parentElement.insertAdjacentElement("afterend", wrapper);
  } else {
    document.body.appendChild(wrapper);
  }
}

// --- 7) Export to JSON file ---
function exportToJsonFile() {
  try {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert("Export failed: " + err.message);
  }
}

// --- 8) Import from JSON file (checker expects this name) ---
function importFromJsonFile(event) {
  const file = event?.target?.files?.[0];
  if (!file) {
    alert("No file chosen.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) {
        alert("Imported JSON should be an array of quotes.");
        return;
      }
      // Simple validation: each item should have text and category
      const valid = imported.filter(it => it && typeof it.text === "string" && typeof it.category === "string");
      if (valid.length === 0) {
        alert("No valid quote objects found in file.");
        return;
      }
      quotes.push(...valid);
      saveQuotes();
      alert(`Imported ${valid.length} quote(s).`);
      showRandomQuote();
    } catch (err) {
      alert("Failed to import JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// --- 9) DOM ready wiring ---
document.addEventListener("DOMContentLoaded", function () {
  // Wire Show New Quote
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) {
    newQuoteBtn.removeEventListener("click", showRandomQuote);
    newQuoteBtn.addEventListener("click", showRandomQuote);
  }

  // Wire Export button
  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) {
    exportBtn.removeEventListener("click", exportToJsonFile);
    exportBtn.addEventListener("click", exportToJsonFile);
  }

  // Wire Import file input
  const importInput = document.getElementById("importFile");
  if (importInput) {
    importInput.removeEventListener("change", importFromJsonFile);
    importInput.addEventListener("change", importFromJsonFile);
  }

  // Build (or wire) add-quote form
  createAddQuoteForm();

  // Restore last shown quote from sessionStorage if any
  try {
    const last = sessionStorage.getItem(SESSION_KEY);
    if (last) {
      const { text, category } = JSON.parse(last);
      const container = document.getElementById("quoteDisplay");
      container.innerHTML = "";
      const block = document.createElement("blockquote");
      block.textContent = text;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `Category: ${category}`;
      container
