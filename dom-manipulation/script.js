let quotes = [];

function loadQuotes(){
  const stored = localstorage.getItem("quotes");
    quotes = stored ? JSON.parse(stored) : [];
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function displayQuotes() {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = quotes.map(q => `<p>${q.text} - <em>${q.category}</em></p>`).join("");
}

async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverQuotes = await response.json();

    // Convert server data to quote format
    const formatted = serverQuotes.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));


   formatted.forEach(sq => {
      const exists = quotes.find(lq => lq.text === sq.text);
      if (!exists) {
        quotes.push(sq);
      }
    });

    saveQuotes();
    displayQuotes();
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

setInterval(syncWithServer, 30000);
loadQuotes();
displayQuotes();
