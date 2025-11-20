require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// === PATH CONFIGURATION ===
// Pointing to frontend/pages where your HTML files live
const frontendPages = path.join(__dirname, "..", "frontend", "pages");
console.log("Serving static files from:", frontendPages);
app.use(express.static(frontendPages));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve registration page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPages, "registration.html"));
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "food_ordering",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL database");
});

// --- API ROUTES ---

// 1. Register Endpoint
// 1. Register Endpoint (Debug Version)
app.post("/api/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
      [fullName, email, hash],
      (err, result) => {
        if (err) {
          // LOG THE SPECIFIC ERROR TO CONSOLE
          console.error("REGISTRATION ERROR:", err.sqlMessage);

          if (err.code === "ER_DUP_ENTRY") {
            // Check if the error message mentions 'email'
            if (err.sqlMessage.includes("email")) {
              return res
                .status(409)
                .json({ error: "Email already registered." });
            } else {
              return res
                .status(500)
                .json({ error: "Database Error: Duplicate ID or Key." });
            }
          }
          return res.status(500).json({ error: "Database error." });
        }
        res.json({ success: true });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// 2. Login Endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required." });

  // FIXED: Using SELECT to find the user, not INSERT
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error." });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid credentials." });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ error: "Invalid credentials." });

      // Send back user info
      res.json({
        success: true,
        user: { id: user.id, fullName: user.full_name, email: user.email },
      });
    }
  );
});

// 3. Place Order Endpoint (Must be OUTSIDE the login function)
app.post("/api/orders", (req, res) => {
  const { userId, total, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  // Insert Order
  db.query(
    "INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'pending')",
    [userId, total],
    (err, result) => {
      if (err) {
        console.error("Order insert failed:", err);
        return res.status(500).json({ error: "Failed to create order" });
      }

      const orderId = result.insertId;

      // Insert Order Items (Bulk Insert)
      const orderItemsData = items.map((item) => [orderId, item.id, item.qty]);

      db.query(
        "INSERT INTO order_items (order_id, menu_id, quantity) VALUES ?",
        [orderItemsData],
        (err) => {
          if (err) {
            console.error("Order items insert failed:", err);
            return res.status(500).json({
              error: "Failed to save items. Check if Menu IDs exist in DB.",
            });
          }
          res.json({ success: true, orderId });
        }
      );
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
