 // Function to display a random quote and update the DOM
function displayRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    var emptyEl = document.getElementById("quoteDisplay");
    if (emptyEl) emptyEl.innerHTML = "No quotes available."; // <-- innerHTML used
    return null;
  }

  // logic to select a random quote
  var randomIndex = Math.floor(Math.random() * quotes.length);
  var randomQuote = quotes[randomIndex];

  // update the DOM using innerHTML
  var el = document.getElementById("quoteDisplay");
  if (el) {
    el.innerHTML = randomQuote.text + " - " + randomQuote.category; // <-- innerHTML used
  }

  return randomQuote;
}
