const express = require("express");
const db = require("../db");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/**
 * READ-ONLY: list subjects (for everyone)
 * returns: [{ id, name, course_id }]
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, course_id FROM subjects ORDER BY course_id, name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

/**
 * ADMIN: create subject (optional, can skip if you want)
 */
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { name, course_id } = req.body;
    if (!name || !course_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [result] = await db.query(
      "INSERT INTO subjects (name, course_id) VALUES (?, ?)",
      [name, course_id]
    );

    res.json({ message: "Subject created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

module.exports = router;