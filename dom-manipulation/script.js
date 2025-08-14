 // Load quotes from localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Fetch quotes from a simulated server (mock API)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();

        // Convert server posts to quote objects
        return data.map(item => ({
            text: item.title,
            author: `Author ${item.userId}`,
            category: ["inspiration", "life", "humor"][item.id % 3]
        }));
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}

// Post a new quote to the simulated server (mock API)
async function postQuoteToServer(quote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify(quote),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        const result = await response.json();
        console.log("Posted to server:", result);
    } catch (error) {
        console.error("Error posting quote to server:", error);
    }
}

// Sync quotes between server and local storage
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let updated = false;

    // Conflict resolution: server data takes precedence
    serverQuotes.forEach(serverQuote => {
        if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text)) {
            localQuotes.push(serverQuote);
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("quotes", JSON.stringify(localQuotes));
        quotes = localQuotes;
        showNotification("Quotes updated from server (server data prioritized).");
        populateCategories();
        filterQuotes();
    }
}

// Show notification UI
function showNotification(message) {
    let notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.author}`;
}

// Create Add Quote form listener
function createAddQuoteForm() {
    const form = document.getElementById("addQuoteForm");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        await addQuote();
    });
}

// Add a new quote and post to server
async function addQuote() {
    const text = document.getElementById("quoteText").value;
    const author = document.getElementById("quoteAuthor").value;
    const category = document.getElementById("quoteCategory").value;

    if (text && author && category) {
        const newQuote = { text, author, category };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Post new quote to server
        await postQuoteToServer(newQuote);

        populateCategories();
        showNotification("Quote added and posted to server!");
        filterQuotes();
        document.getElementById("addQuoteForm").reset();
    }
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filteredQuotes = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    const display = document.getElementById("quoteDisplay");
    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        display.textContent = `"${randomQuote.text}" - ${randomQuote.author}`;
    } else {
        display.textContent = "No quotes available for this category.";
    }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    populateCategories();
    filterQuotes();
    syncQuotes(); // initial sync

    // Periodic sync every 60s
    setInterval(syncQuotes, 60000);
});
