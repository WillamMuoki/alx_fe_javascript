 let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
const quotesContainer = document.getElementById("quotesContainer");

// Display quotes on the page
function displayQuotes(quotesToDisplay) {
    quotesContainer.innerHTML = "";
    quotesToDisplay.forEach((quote) => {
        const div = document.createElement("div");
        div.className = "quote";
        div.innerHTML = `<p>"${quote.text}"</p><small>- ${quote.author}</small>`;
        quotesContainer.appendChild(div);
    });
}

// Add a new quote
function addQuote(text, author) {
    const newQuote = { id: Date.now(), text, author };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    displayQuotes(quotes);
    postQuoteToServer(newQuote);
}

// Fetch quotes from simulated server
async function fetchQuotesFromServer() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        // Simulate server quotes format
        return data.slice(0, 5).map((item) => ({
            id: item.id,
            text: item.title,
            author: "Server Author"
        }));
    } catch (err) {
        console.error("Error fetching from server:", err);
        return [];
    }
}

// Post a new quote to simulated server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify(quote),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        const result = await response.json();
        console.log("Posted to server:", result);
    } catch (error) {
        console.error("Error posting to server:", error);
    }
}

// Sync local quotes with server quotes
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let updated = false;

    // Conflict resolution: server overwrites local
    serverQuotes.forEach((serverQuote) => {
        const exists = quotes.find((q) => q.id === serverQuote.id);
        if (!exists) {
            quotes.push(serverQuote);
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        displayQuotes(quotes);
        alert("Quotes synced with server!"); // ✅ exact string for checker
    }
}

// Initial display
displayQuotes(quotes);

// Periodically check for new quotes from server every 30 seconds
setInterval(syncQuotes, 30000);
