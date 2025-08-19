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

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous content

  // Create elements manually
  const p = document.createElement("p");
  p.textContent = `"${quote.text}"`;

  const small = document.createElement("small");
  small.textContent = `Category: ${quote.category}`;

  // Append to container
  quoteDisplay.appendChild(p);
  quoteDisplay.appendChild(small);
}

// Function to add a new quote
function addQuote(text, category) {
  quotes.push({ text, category });
  showRandomQuote(); // Immediately show updated list
}

// Function to create a form for adding quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = ""; // Clear any existing form

  // Create input for quote text
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "quoteText";
  inputText.placeholder = "Enter quote";

  // Create input for category
  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "quoteCategory";
  inputCategory.placeholder = "Enter category";

  // Create button
  const button = document.createElement("button");
  button.id = "addQuoteBtn";
  button.textContent = "Add Quote";

  // Append inputs and button
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(button);

  // Add event listener
  button.addEventListener("click", function () {
    const text = inputText.value.trim();
    const category = inputCategory.value.trim();

    if (text && category) {
      addQuote(text, category);
      inputText.value = "";
      inputCategory.value = "";
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


