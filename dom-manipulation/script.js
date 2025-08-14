 // Initial quotes array (from localStorage or empty)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Fetch quotes from a simulated server
function fetchQuotesFromServer() {
    return fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
        .then(response => response.json())
        .then(data => {
            // Convert server posts to quote objects with random categories
            return data.map(item => ({
                text: item.title,
                author: `Author ${item.userId}`,
                category: ["inspiration", "life", "humor"][item.id % 3]
            }));
        })
        .catch(error => {
            console.error("Error fetching quotes from server:", error);
            return [];
        });
}

// Sync quotes between server and local storage
function syncQuotes() {
    fetchQuotesFromServer().then(serverQuotes => {
        let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
        let updated = false;

        // Conflict resolution: server data takes precedence
        serverQuotes.forEach(serverQuote => {
            if (!localQuotes.some(localQuote => localQuote.text === serverQuote.text)) {
                localQuotes.push(serverQuote);
                updated = true;
            }
        });

        // If there were updates, save to local storage and notify
        if (updated) {
            localStorage.setItem("quotes", JSON.stringify(localQuotes));
            quotes = localQuotes;
            showNotification("Quotes updated from server (server data prioritized).");
            populateCategories();
            filterQuotes();
        }
    });
}

// Show notification UI
function showNotification(message) {
    let notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" - ${quote.author}`;
}

// Create Add Quote form
function createAddQuoteForm() {
    const form = document.getElementById("addQuoteForm");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        addQuote();
    });
}

// Add a new quote
function addQuote() {
    const text = document.getElementById("quoteText").value;
    const author = document.getElementById("quoteAuthor").value;
    const category = document.getElementById("quoteCategory").value;

    if (text && author && category) {
        quotes.push({ text, author, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        showNotification("Quote added successfully!");
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

    // Restore last selected filter from localStorage
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
    }
}

// Filter quotes by selected category
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
    populateCategories();
    filterQuotes();
    syncQuotes(); // initial sync

    // Periodically c
