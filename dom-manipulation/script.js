// Quotes array with objects containing text and category properties
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't watch the clock; do what it does. Keep going.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Wisdom" }
];

// Function to display a random quote and update the DOM
function displayRandomQuote() {
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `${randomQuote.text} - ${randomQuote.category}`;
}

// Function to add a new quote to the array and update the DOM
function addQuote(text, category) {
    quotes.push({ text: text, category: category });
    displayRandomQuote();
}

// Event listener on the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
