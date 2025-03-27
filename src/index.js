const toggleViewButton = document.querySelector(".toggle-view-button");
const sortButton = document.querySelector(".sort-button");
const bookContainer = document.querySelector(".parent-container");
const searchField = document.querySelector(".search-field");

let cardImageContainers = [];
let cardImages = [];
let cards = [];
let bookList = [];

let isGrid = false;

// Fetch book data from FreeAPI.app
async function fetchData() {
  const URL = "https://api.freeapi.app/api/v1/public/books";

  try {
    const res = await fetch(URL);
    const jsonData = await res.json();
    bookList = jsonData.data.data;
    renderBookList(bookList);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Render book cards from list
function renderBookList(list) {
  bookContainer.innerHTML = "";

  list.forEach((book) => {
    const { title, authors, publisher, publishedDate, imageLinks } = book.volumeInfo;

    const cardHTML = `
      <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full flex flex-col sm:flex-row h-64">
        <div class="card-image-container w-full sm:w-1/3 h-full">
          <img src="${imageLinks?.thumbnail}"
               alt="Book Cover"
               class="card-image w-full h-full object-cover" />
        </div>
        <div class="card-details p-5 flex flex-col justify-between flex-1">
          <div>
            <h2 class="text-2xl font-semibold mb-1">${title || "No Title"}</h2>
            <p class="text-sm text-gray-600 mb-1">Author: <span class="font-medium">${authors?.join(", ") || "Unknown"}</span></p>
            <p class="text-sm text-gray-600 mb-1">Publisher: ${publisher || "N/A"}</p>
            <p class="text-sm text-gray-600">Published: ${publishedDate || "Unknown"}</p>
          </div>
        </div>
      </div>
    `;

    bookContainer.insertAdjacentHTML("beforeend", cardHTML);
  });

  updateCardSelectors();
}

// Update card references after rendering
function updateCardSelectors() {
  cards = document.querySelectorAll(".parent-container > div");
  cardImageContainers = document.querySelectorAll(".card-image-container");
  cardImages = document.querySelectorAll(".card-image");

  // Ensure toggle works on new cards
  if (isGrid) {
    applyGridStyles();
  } else {
    applyListStyles();
  }
}

// Toggle between list and grid views
toggleViewButton.addEventListener("click", () => {
  isGrid = !isGrid;

  if (isGrid) {
    applyGridStyles();
    toggleViewButton.textContent = "List View";
  } else {
    applyListStyles();
    toggleViewButton.textContent = "Grid View";
  }
});

// Apply grid styles
function applyGridStyles() {
  bookContainer.classList.remove("space-y-6");
  bookContainer.classList.add(
    "grid",
    "grid-cols-1",
    "sm:grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
    "gap-6",
    "mt-10"
  );

  cards.forEach((card) => {
    card.classList.remove("flex", "flex-col", "sm:flex-row", "h-64");
  });

  cardImageContainers.forEach((container) => {
    container.classList.remove("w-full", "sm:w-1/3", "h-full");
  });

  cardImages.forEach((img) => {
    img.classList.remove("w-full", "h-full");
    img.classList.add("w-full", "h-72", "object-cover");
  });
}

// Apply list styles
function applyListStyles() {
  bookContainer.classList.add("space-y-6");
  bookContainer.classList.remove(
    "grid",
    "grid-cols-1",
    "sm:grid-cols-2",
    "md:grid-cols-3",
    "lg:grid-cols-4",
    "gap-6",
    "mt-10"
  );

  cards.forEach((card) => {
    card.classList.add("flex", "flex-col", "sm:flex-row", "h-64");
  });

  cardImageContainers.forEach((container) => {
    container.classList.add("w-full", "sm:w-1/3", "h-full");
  });

  cardImages.forEach((img) => {
    img.classList.remove("h-72");
    img.classList.add("w-full", "h-full", "object-cover");
  });
}

// Sort books by title
sortButton.addEventListener("click", () => {
  bookList.sort((a, b) =>
    a.volumeInfo.title.localeCompare(b.volumeInfo.title)
  );
  renderBookList(bookList);
});

// Initial call on page load
fetchData();


searchField.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  const filteredBooks = bookList.filter((book) => {
    const title = book.volumeInfo.title?.toLowerCase() || "";
    const authors = book.volumeInfo.authors?.join(", ").toLowerCase() || "";

    return title.includes(searchTerm) || authors.includes(searchTerm);
  });

  renderBookList(filteredBooks);
});