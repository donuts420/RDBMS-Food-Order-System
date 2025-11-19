//  Registration Page

function showMessage(message, type = "success") {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.classList.remove(
    "hidden",
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800"
  );
  messageBox.classList.add(
    type === "success" ? "bg-green-100" : "bg-red-100",
    type === "success" ? "text-green-800" : "text-red-800",
    "opacity-100"
  );

  setTimeout(() => {
    messageBox.classList.remove("opacity-100");
    messageBox.classList.add("opacity-0");
    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 300);
  }, 5000);
}

function handleRegistration(event) {
  event.preventDefault(); // Stop the form from submitting normally

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    showMessage("Error: Passwords do not match. Please try again.", "error");
    return;
  }

  // In a real application, you would send this data to a server.
  // For this example, we'll just simulate a successful registration.

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;

  console.log(`Attempting to register user: ${fullName}, ${email}`);

  // Simulate API call delay
  setTimeout(() => {
    showMessage("Registration successful! Redirecting to Log In...", "success");

    // Simulate redirection after a short delay
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  }, 500);
}
console.log("Registration page script loaded.");

//  Login Page

function showMessage(message, type = "success") {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.classList.remove(
    "hidden",
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800"
  );
  messageBox.classList.add(
    type === "success" ? "bg-green-100" : "bg-red-100",
    type === "success" ? "text-green-800" : "text-red-800",
    "opacity-100"
  );

  setTimeout(() => {
    messageBox.classList.remove("opacity-100");
    messageBox.classList.add("opacity-0");
    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 300);
  }, 5000);
}

function handleLogin(event) {
  event.preventDefault(); // Stop the form from submitting normally

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(`Attempting to log in user: ${email}`);

  // Simulate API call delay
  setTimeout(() => {
    // In a real app, check credentials here.
    // We'll simulate a successful login for demonstration.
    showMessage("Login successful! Redirecting to home...", "success");

    // Simulate redirection after a short delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }, 500);
}

console.log("Login page script loaded.");

// cart.js
// Separated JS for the Food Ordering System index page

// Sample menu data
const MENU = [
  {
    id: 1,
    name: "Margherita Pizza",
    desc: "Classic cheese & tomato",
    price: 249,
    tag: "Veg",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    desc: "Pepperoni & mozzarella",
    price: 299,
    tag: "Non-Veg",
  },
  {
    id: 3,
    name: "Veg Biryani",
    desc: "Aromatic basmati with veggies",
    price: 199,
    tag: "Veg",
  },
  {
    id: 4,
    name: "Chicken Biryani",
    desc: "Spiced chicken with rice",
    price: 249,
    tag: "Non-Veg",
  },
  {
    id: 5,
    name: "Paneer Butter Masala",
    desc: "Rich tomato & butter gravy",
    price: 179,
    tag: "Veg",
  },
  {
    id: 6,
    name: "Fried Rice",
    desc: "Veg fried rice with sauces",
    price: 149,
    tag: "Veg",
  },
  {
    id: 7,
    name: "Grilled Sandwich",
    desc: "Toasted sandwich with veggies",
    price: 129,
    tag: "Veg",
  },
  {
    id: 8,
    name: "Chicken Burger",
    desc: "Spicy chicken patty",
    price: 199,
    tag: "Non-Veg",
  },
];

const CART_KEY = "food_ordering_cart_v1";
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

// DOM elements
const menuGrid = document.getElementById("menuGrid");
const menuSearch = document.getElementById("menuSearch");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

function formatCurrency(n) {
  return `₹${n.toFixed(2)}`;
}
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}
function findMenuItem(id) {
  return MENU.find((m) => m.id === id);
}

function renderMenu(filter = "") {
  menuGrid.innerHTML = "";
  const q = filter.trim().toLowerCase();
  const items = MENU.filter(
    (it) =>
      !q ||
      it.name.toLowerCase().includes(q) ||
      it.desc.toLowerCase().includes(q) ||
      it.tag.toLowerCase().includes(q)
  );
  if (items.length === 0) {
    menuGrid.innerHTML = `<p class=\"text-gray-500\">No items match your search.</p>`;
    return;
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "border rounded-lg p-4 flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <div class=\"flex items-center justify-between mb-2\">
          <h4 class=\"font-semibold text-secondary\">${item.name}</h4>
          <span class=\"text-sm text-gray-500\">${item.tag}</span>
        </div>
        <p class=\"text-sm text-gray-600 mb-3\">${item.desc}</p>
      </div>
      <div class=\"flex items-center justify-between\">
        <div class=\"text-lg font-semibold\">${formatCurrency(item.price)}</div>
        <div>
          <button data-id=\"${
            item.id
          }\" class=\"addBtn px-3 py-1 bg-primary text-white rounded-lg text-sm hover:opacity-90\">Add to cart</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });

  document.querySelectorAll(".addBtn").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      addToCart(id);
    })
  );
}

function addToCart(id, qty = 1) {
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  showToast("Added to cart");
}

function updateQty(id, qty) {
  const idx = cart.findIndex((c) => c.id === id);
  if (idx === -1) return;
  if (qty <= 0) cart.splice(idx, 1);
  else cart[idx].qty = qty;
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
}

function clearCart() {
  cart = [];
  saveCart();
}

function cartSubtotal() {
  return cart.reduce((sum, c) => {
    const item = findMenuItem(c.id);
    return sum + (item ? item.price * c.qty : 0);
  }, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  if (!cart || cart.length === 0) {
    cartEmptyEl.style.display = "block";
    cartSubtotalEl.textContent = formatCurrency(0);
    placeOrderBtn.disabled = true;
    return;
  }
  cartEmptyEl.style.display = "none";
  cart.forEach((c) => {
    const item = findMenuItem(c.id);
    const row = document.createElement("div");
    row.className = "flex items-center justify-between gap-3";
    row.innerHTML = `
      <div class=\"flex-1\">
        <div class=\"font-medium text-sm\">${item.name}</div>
        <div class=\"text-xs text-gray-500\">${formatCurrency(
          item.price
        )} each</div>
      </div>
      <div class=\"flex items-center gap-2\">
        <button data-id=\"${
          c.id
        }\" class=\"qty-minus px-2 py-1 border rounded\">-</button>
        <input data-id=\"${c.id}\" type=\"number\" min=\"1\" value=\"${
      c.qty
    }\" class=\"w-14 text-center input-field border rounded px-1 py-1\" />
        <button data-id=\"${
          c.id
        }\" class=\"qty-plus px-2 py-1 border rounded\">+</button>
        <div class=\"ml-3 text-sm font-semibold\">${formatCurrency(
          item.price * c.qty
        )}</div>
        <button data-id=\"${
          c.id
        }\" class=\"removeBtn ml-2 text-red-500 text-sm\">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartItemsEl.querySelectorAll(".qty-minus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const current = cart.find((x) => x.id === id);
      if (current) updateQty(id, current.qty - 1);
    });
  });
  cartItemsEl.querySelectorAll(".qty-plus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const current = cart.find((x) => x.id === id);
      if (current) updateQty(id, current.qty + 1);
    });
  });
  cartItemsEl.querySelectorAll("input[type='number']").forEach((inp) => {
    inp.addEventListener("change", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      let v = parseInt(e.currentTarget.value || "1", 10);
      if (isNaN(v) || v < 1) v = 1;
      updateQty(id, v);
    });
  });
  cartItemsEl.querySelectorAll(".removeBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      removeFromCart(id);
    });
  });

  cartSubtotalEl.textContent = formatCurrency(cartSubtotal());
  placeOrderBtn.disabled = false;
}

placeOrderBtn.addEventListener("click", () => {
  if (!cart || cart.length === 0) return;
  const lines = cart.map((c) => {
    const item = findMenuItem(c.id);
    return `${item.name} x ${c.qty} = ${formatCurrency(item.price * c.qty)}`;
  });
  const subtotal = cartSubtotal();
  const summary = `${lines.join("\n")}\n\nSubtotal: ${formatCurrency(
    subtotal
  )}`;
  showToast("Order placed! Check console for summary.");
  console.log("Order summary:\n", summary);
  clearCart();
});

clearCartBtn.addEventListener("click", () => {
  if (!cart || cart.length === 0) return;
  if (confirm("Clear the cart?")) clearCart();
});

let toastTimer = null;
function showToast(msg) {
  toastText.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2800);
}

menuSearch.addEventListener("input", (e) => renderMenu(e.target.value));
renderMenu();
renderCart();

window.addEventListener("storage", () => {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  renderCart();
});
