 // Default quotes with categories
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" }
];

// Restore last selected category
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Clear old options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore selection
  categoryFilter.value = lastSelectedCategory;
}

function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  lastSelectedCategory = category;
  localStorage.setItem("selectedCategory", category);

  const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);
  displayQuote(filteredQuotes.length > 0 ? filteredQuotes[0] : { text: "No quotes in this category.", category: "" });
}

function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filteredQuotes = category === "all" ? quotes : quotes.filter(q => q.category === category);

  if (filteredQuotes.length === 0) {
    displayQuote({ text: "No quotes in this category.", category: "" });
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  displayQuote(filteredQuotes[randomIndex]);
}

function displayQuote(quote) {
  document.getElementById("quoteDisplay").textContent = quote.text + (quote.category ? ` — ${quote.category}` : "");
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");
  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="newQuoteText" placeholder="Enter quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();
  filterQuotes();
});
