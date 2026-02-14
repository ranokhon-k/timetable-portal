const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student')",
      [name, email, hash]
    );

    res.json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ message: "Registration error", error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    req.session.userId = user.id;
    req.session.role = user.role;

    res.json({ message: "Logged in", userId: user.id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ✅ LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

module.exports = router;