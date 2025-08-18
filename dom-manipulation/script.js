 // Quotes array with text and category
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" },
  { text: "If you are working on something exciting, it will keep you motivated.", category: "Work" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Update the DOM with innerHTML
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

// Function to add a new quote
function addQuote(text, category) {
  quotes.push({ text, category });
  showRandomQuote(); // Show a random (possibly new) quote
}

// Function to create a form for adding quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  formContainer.innerHTML = `
    <input type="text" id="quoteText" placeholder="Enter quote" />
    <input type="text" id="quoteCategory" placeholder="Enter category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.getElementById("addQuoteBtn").addEventListener("click", function () {
    const text = document.getElementById("quoteText").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && category) {
      addQuote(text, category);
      document.getElementById("quoteText").value = "";
      document.getElementById("quoteCategory").value = "";
    } else {
      alert("Please enter both quote and category!");
    }
  });
}

// Event listener for "Show New Quote" button
document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);

// Initial setup
showRandomQuote();
createAddQuoteForm();
