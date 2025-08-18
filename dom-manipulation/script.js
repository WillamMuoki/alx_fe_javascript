// === Quotes Array ===
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Inspiration" }
];

// === Local Storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

// === Display Random Quote ===
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `${quote.text} (${quote.category})`;
}

// === Add Quote ===
function addQuote(text, category) {
  quotes.push({ text, category });
  saveQuotes();
  displayRandomQuote();
}

// === Fetch from Mock API ===
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 3).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Error fetching:", err);
    return [];
  }
}

// === Sync with Server ===
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let newQuotesAdded = false;

  serverQuotes.forEach(sq => {
    if (!quotes.some(q => q.text === sq.text)) {
      quotes.push(sq);
      newQuotesAdded = true;
    }
  });

  saveQuotes();

  if (newQuotesAdded) {
    alert("Quotes synced with server!");
  }
}

// === Event Listeners ===
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

document.getElementById("addQuoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("quoteText").value;
  const category = document.getElementById("quoteCategory").value;
  addQuote(text, category);
  e.target.reset();
});

// === Init ===
loadQuotes();
displayRandomQuote();
setInterval(syncQuotes, 10000); // sync every 10s
