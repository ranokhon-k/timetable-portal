const express = require("express");
const db = require("../db");
const { requireLogin, requireAdmin } = require("../middleware/auth");

const router = express.Router();

/*
 READ-ONLY: view timetable
 Accessible by students and admin
*/
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.id,
        s.name AS subject,
        r.name AS room,
        t.day,
        t.start_time,
        t.end_time
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN rooms r ON t.room_id = r.id
      ORDER BY t.day, t.start_time
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({
      message: "Database error",
      error: err.message
    });
  }
});

/*
 ADMIN ONLY: add timetable entry
*/
router.post("/", requireLogin, requireAdmin, async (req, res) => {
  try {
    const { subject_id, room_id, day, start_time, end_time } = req.body;

    if (!subject_id || !room_id || !day || !start_time || !end_time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await db.query(
      `INSERT INTO timetable (subject_id, room_id, day, start_time, end_time)
       VALUES (?, ?, ?, ?, ?)`,
      [subject_id, room_id, day, start_time, end_time]
    );

    res.json({ message: "Timetable entry created" });
  } catch (err) {
    res.status(500).json({
      message: "Database error",
      error: err.message
    });
  }
});

module.exports = router;