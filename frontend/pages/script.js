// --- Shared Utilities ---
function showMessage(message, type = "success") {
  const messageBox = document.getElementById("messageBox");
  if (!messageBox) return;

  messageBox.textContent = message;
  messageBox.classList.remove(
    "hidden",
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800",
    "opacity-0"
  );

  if (type === "success") {
    messageBox.classList.add("bg-green-100", "text-green-800", "opacity-100");
  } else {
    messageBox.classList.add("bg-red-100", "text-red-800", "opacity-100");
  }

  setTimeout(() => {
    messageBox.classList.remove("opacity-100");
    messageBox.classList.add("opacity-0");
    setTimeout(() => {
      messageBox.classList.add("hidden");
    }, 300);
  }, 5000);
}

// --- Registration Page Logic ---
const regForm = document.getElementById("registrationForm");
if (regForm) {
  regForm.addEventListener("submit", handleRegistration);
}

async function handleRegistration(event) {
  event.preventDefault();

  const submitBtn = regForm.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.innerText;

  // 1. DISABLE BUTTON to prevent double-clicks
  submitBtn.disabled = true;
  submitBtn.innerText = "Registering...";

  const fullName = document.getElementById("fullName").value?.trim();
  const email = document.getElementById("email").value?.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!fullName || !email || !password) {
    showMessage("All fields are required.", "error");
    resetButton();
    return;
  }
  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");
    resetButton();
    return;
  }

  try {
    const resp = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      showMessage(data.error || "Registration failed", "error");
      resetButton(); // Re-enable button on error
      return;
    }

    showMessage("Registration successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

    // Note: We do NOT re-enable the button here because we are redirecting.
  } catch (err) {
    console.error("Registration error:", err);
    showMessage("Server error. Check console.", "error");
    resetButton();
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.innerText = originalBtnText;
  }
}

// --- Login Page Logic ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

async function handleLogin(event) {
  event.preventDefault(); // Prevents default submission

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      showMessage(data.error || "Login failed", "error");
      return;
    }

    // IMPORTANT: Save User to LocalStorage for ordering later
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    showMessage("Login successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } catch (err) {
    console.error(err);
    showMessage("Network error", "error");
  }
}

// --- Main Menu / Cart Logic ---
const menuGrid = document.getElementById("menuGrid");

if (menuGrid) {
  // Ensure these IDs match your SQL Database 'menu' table IDs!
  const MENU = [
    {
      id: 1,
      name: "Margherita Pizza",
      desc: "Classic cheese & tomato",
      price: 299,
      tag: "Veg",
    },
    {
      id: 2,
      name: "Farmhouse Pizza",
      desc: "Veggies everywhere!",
      price: 399,
      tag: "Veg",
    },
    {
      id: 3,
      name: "Veg Burger",
      desc: "A delicious burger with fries",
      price: 149,
      tag: "Veg",
    },
    {
      id: 4,
      name: "Pasta Alfredo",
      desc: "Creamy white sauce pasta",
      price: 249,
      tag: "Veg",
    },
    {
      id: 5,
      name: "Cold Coffee",
      desc: "Iced coffee with cream",
      price: 99,
      tag: "Veg",
    },
  ];

  const CART_KEY = "food_ordering_cart_v1";
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

  // Elements
  const cartItemsEl = document.getElementById("cartItems");
  const cartEmptyEl = document.getElementById("cartEmpty");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const placeOrderBtn = document.getElementById("placeOrderBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toastText");
  const menuSearch = document.getElementById("menuSearch");

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
      menuGrid.innerHTML = `<p class="text-gray-500 col-span-2 text-center py-4">No items match your search.</p>`;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "border rounded-lg p-4 flex flex-col justify-between bg-white hover:shadow-md transition-shadow";
      card.innerHTML = `
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-secondary">${item.name}</h4>
                  <span class="text-xs font-medium px-2 py-1 rounded ${
                    item.tag === "Veg"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }">${item.tag}</span>
                </div>
                <p class="text-sm text-gray-600 mb-3">${item.desc}</p>
              </div>
              <div class="flex items-center justify-between mt-auto">
                <div class="text-lg font-bold text-secondary">${formatCurrency(
                  item.price
                )}</div>
                <button data-id="${
                  item.id
                }" class="addBtn px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">Add</button>
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
      if (!item) return;

      const row = document.createElement("div");
      row.className =
        "flex items-center justify-between gap-3 p-2 border-b border-gray-50 last:border-0";
      row.innerHTML = `
              <div class="flex-1">
                <div class="font-medium text-sm text-gray-800">${
                  item.name
                }</div>
                <div class="text-xs text-gray-500">${formatCurrency(
                  item.price
                )} each</div>
              </div>
              <div class="flex items-center gap-2">
                <button data-id="${
                  c.id
                }" class="qty-minus w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50">-</button>
                <span class="w-6 text-center text-sm font-medium">${
                  c.qty
                }</span>
                <button data-id="${
                  c.id
                }" class="qty-plus w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50">+</button>
              </div>
              <button data-id="${
                c.id
              }" class="removeBtn text-red-500 hover:text-red-700 p-1">
                Remove
              </button>
            `;
      cartItemsEl.appendChild(row);
    });

    cartItemsEl
      .querySelectorAll(".qty-minus")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          updateQty(
            Number(e.currentTarget.dataset.id),
            cart.find((x) => x.id === Number(e.currentTarget.dataset.id)).qty -
              1
          )
        )
      );
    cartItemsEl
      .querySelectorAll(".qty-plus")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          updateQty(
            Number(e.currentTarget.dataset.id),
            cart.find((x) => x.id === Number(e.currentTarget.dataset.id)).qty +
              1
          )
        )
      );
    cartItemsEl
      .querySelectorAll(".removeBtn")
      .forEach((btn) =>
        btn.addEventListener("click", (e) =>
          removeFromCart(Number(e.currentTarget.dataset.id))
        )
      );

    cartSubtotalEl.textContent = formatCurrency(cartSubtotal());
    placeOrderBtn.disabled = false;
  }

  // Place Order - Sends data to server
  placeOrderBtn.addEventListener("click", async () => {
    if (!cart || cart.length === 0) return;

    // Get logged-in user
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      alert("Please log in to place an order.");
      window.location.href = "login.html";
      return;
    }
    const user = JSON.parse(userStr);

    const orderPayload = {
      userId: user.id,
      total: cartSubtotal(),
      items: cart,
    };

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await resp.json();

      if (data.success) {
        showToast("Order placed successfully!");
        console.log("Order ID:", data.orderId);
        clearCart();
      } else {
        showToast("Failed: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      showToast("Server error. Try again.");
    }
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (!cart || cart.length === 0) return;
      if (confirm("Clear the cart?")) clearCart();
    });
  }

  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 2800);
  }

  if (menuSearch) {
    menuSearch.addEventListener("input", (e) => renderMenu(e.target.value));
  }

  renderMenu();
  renderCart();

  window.addEventListener("storage", () => {
    cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    renderCart();
  });
}
