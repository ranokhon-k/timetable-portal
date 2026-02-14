const express = require("express");
const db = require("../db");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public read-only endpoint: list all courses
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM courses ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Admin-only endpoint: create a new course
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Missing course name" });
    }

    const [result] = await db.query(
      "INSERT INTO courses (name) VALUES (?)",
      [name]
    );

    res.json({ message: "Course created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// Admin-only endpoint: delete a course
router.delete("/:id", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM courses WHERE id = ?", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

module.exports = router;