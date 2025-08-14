 // === 1) Quotes array (objects with text & category) ===
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Whether you think you can or you think you can't, you're right.", category: "Mindset" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "Teamwork" },
  { text: "Simplicity is the soul of efficiency.", category: "Engineering" },
];

// Small utility to render a message into #quoteDisplay
function renderMessage(msg) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = msg;
  container.appendChild(p);
}

// === 2) REQUIRED: displayRandomQuote (random selection + DOM update) ===
function displayRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    renderMessage("No quotes yet. Add one below!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];

  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";

  const block = document.createElement("blockquote");
  block.textContent = text;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `Category: ${category}`;

  container.append(block, meta);
}

// === 3) REQUIRED: addQuote (push to array + update DOM) ===
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");

  const text = (textInput.value || "").trim();
  const category = (catInput.value || "").trim();

  if (!text || !category) {
    renderMessage("Please enter both a quote and a category.");
    return;
  }

  // Add new quote object to quotes array
  quotes.push({ text, category });

  // Clear inputs
  textInput.value = "";
  catInput.value = "";

  // Give immediate feedback by showing the newly added category quote
  displayRandomQuote();
}

// === 4) REQUIRED: Event listener on the "Show New Quote" button ===
document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById("newQuote");
  if (btn) {
    btn.addEventListener("click", displayRandomQuote);
  }

  // Optional: show one quote on initial load
  displayRandomQuote();
});
