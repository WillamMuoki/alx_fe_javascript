 // Quotes array with text and category
const quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    document.getElementById("quoteDisplay").innerText = randomQuote.text;
    document.getElementById("quoteCategory").innerText = `Category: ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote(text, category) {
    quotes.push({ text, category });
    displayRandomQuote(); // update the DOM with the new quote
}

// Event listener for "Show New Quote" button
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
