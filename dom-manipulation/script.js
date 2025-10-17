let quotes = [];
let selectedCategory = "all"; // Track the current filter

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  quotes = stored ? JSON.parse(stored) : [];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote based on selectedCategory
function showRandomQuote() {
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    alert("No quotes available in this category.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = `<p>${quote.text} - <em>${quote.category}</em></p>`;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayFilteredQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Create form dynamically
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Populate category dropdown
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];
  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    filter.value = lastFilter;
    selectedCategory = lastFilter;
  }
}

// Filter quotes by category
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selectedCategory);
  displayFilteredQuotes();
}

// Display quotes based on selectedCategory
function displayFilteredQuotes() {
  const display = document.getElementById("quoteDisplay");
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  display.innerHTML = filtered.map(q => `<p>${q.text} - <em>${q.category}</em></p>`).join("");
}

// Export quotes to JSON
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      displayFilteredQuotes();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initial setup
loadQuotes();
createAddQuoteForm();
populateCategories();
displayFilteredQuotes();

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
