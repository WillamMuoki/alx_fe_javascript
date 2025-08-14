 // === Quotes array ===
const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Whether you think you can or you think you can't, you're right.", category: "Mindset" },
  { text: "If you want to go fast, go alone. If you want to go far, go together.", category: "Teamwork" },
  { text: "Simplicity is the soul of efficiency.", category: "Engineering" },
];

// Utility: render a message
function renderMessage(msg) {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = msg;
  container.appendChild(p);
}

// === Show a random quote ===
function showRandomQuote() {
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

// === Add a quote ===
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const catInput = document.getElementById("newQuoteCategory");

  const text = (textInput?.value || "").trim();
  const category = (catInput?.value || "").trim();

  if (!text || !category) {
    renderMessage("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  if (textInput) textInput.value = "";
  if (catInput) catInput.value = "";

  showRandomQuote();
}

// === NEW: Dynamically build the Add-Quote form ===
function createAddQuoteForm() {
  // If the form already exists in your HTML, just hook up the button and exit.
  const existingText = document.getElementById("newQuoteText");
  const existingCat = document.getElementById("newQuoteCategory");
  const existingBtn = document.getElementById("addQuoteBtn");
  if (existingText && existingCat) {
    if (existingBtn) {
      // Ensure we use JS event listener (avoid double-calls if inline onclick exists)
      existingBtn.onclick = null;
      existingBtn.addEventListener("click", addQuote);
    }
    return;
  }

  // Otherwise, create it dynamically.
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

  // Insert right after the “Show New Quote” button if available; else append to body.
  const showBtn = document.getElementById("newQuote");
  if (showBtn && showBtn.parentElement) {
    showBtn.parentElement.insertAdjacentElement("afterend", wrapper);
  } else {
    document.body.appendChild(wrapper);
  }
}

// === Wire up events ===
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", showRandomQuote);

  // Build (or wire up) the Add-Quote form
  createAddQuoteForm();

  // Optionally show one quote on load
  showRandomQuote();
});
