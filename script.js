// Sample Products with IDs
const products = [
  { id: 1, name: "Little women", genre: "Mystery", price: 1000, img: "book2.webp" },
  { id: 2, name: "The Book Thief", genre: "fiction", price: 800, img: "book2.png" },
  { id: 3, name: "The Big Deal", genre: "mystery", price: 1200, img: "book3.jpg" },
  { id: 4, name: "The Call of the Wild", genre: "romance", price: 270, img: "book1.jpg" },
  { id: 5, name: "The Great GATSBY", genre: "science", price: 899, img: "book4.jpg" },
  { id: 6, name: "It Ends With Us", genre: "romance", price: 699, img: "book5.png" },
  { id: 7, name: "How To Die Famous", genre: "nonfiction", price: 350, img: "book6.jpg" }
];

let cartItems = JSON.parse(localStorage.getItem("cart") || "[]");



// Render books to page
function renderBooks(bookList) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (bookList.length === 0) {
    container.innerHTML = "<p>No books found.</p>";
    return;
  }

  bookList.forEach(book => {
    const card = document.createElement("div");
    card.className = "border rounded p-4 shadow hover:shadow-lg bg-white flex flex-col justify-between";

    card.innerHTML = `
      <img src="${book.image}" alt="${book.title}" class="h-40 w-full object-contain mb-4" />
      <h3 class="font-semibold text-lg">${book.title}</h3>
      <p class="text-gray-600">Genre: ${book.genre}</p>
      <p class="text-blue-700 font-bold">₹${book.price}</p>
      <button onclick="addToCart(${book.id})" class="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(bookId) {
  const book = products.find(b => b.id === bookId);
  cartItems.push(book);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartCount();

  // Show popup
  const popup = document.getElementById("cart-popup");
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2000);
}

function updateCartCount() {
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = cartItems.length);
}

// Filter logic
function applyFilters() {
  const query = document.getElementById("search").value.toLowerCase();
  const genre = document.getElementById("genre-filter").value;
  const price = document.getElementById("price-filter").value;

  let filtered = products.filter(book => book.title.toLowerCase().includes(query));

  if (genre !== "all") {
    filtered = filtered.filter(book => book.genre === genre);
  }

  if (price !== "all") {
    filtered = filtered.filter(book => {
      if (price === "0-500") return book.price <= 500;
      if (price === "500-1000") return book.price > 500 && book.price <= 1000;
      if (price === "1000+") return book.price > 1000;
    });
  }

  renderBooks(filtered);
}

// Event listeners
document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("price-filter").addEventListener("change", applyFilters);
document.getElementById("genre-filter").addEventListener("change", applyFilters);

// On page load
renderBooks(products);
updateCartCount();

function handleCheckout() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("You must be logged in to checkout.");
    window.location.href = "login.html";
    return;
  }

  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("mobile").value;
  const delivery = document.getElementById("delivery-option").value;
  const payment = document.getElementById("payment-method").value;
  const total = document.getElementById("cart-total").textContent;

  if (!address || !email || !phone) {
    alert("Please complete all delivery fields.");
    return;
  }

  const order = {
    address,
    email,
    phone,
    delivery,
    payment,
    total,
    items: cartItems, // assumes cartItems is an array of product objects
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));

  // Clear cart
  cartItems = [];
  localStorage.setItem("cart", JSON.stringify(cartItems));

  window.location.href = "confirmation.html";
}
