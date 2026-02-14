const express = require("express");
const db = require("../db");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// READ-ONLY: get all rooms (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, capacity FROM rooms ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// ADMIN: add new room
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      "INSERT INTO rooms (name, capacity) VALUES (?, ?)",
      [name, capacity]
    );

    res.json({ message: "Room created" });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

// ADMIN: delete room
router.delete("/:id", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM rooms WHERE id = ?", [id]);
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err.message });
  }
});

module.exports = router;