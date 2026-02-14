const path = require("path");
const authRoutes = require("./routes/auth");
const coursesRoutes = require("./routes/courses");
const roomsRoutes = require("./routes/rooms");
const timetableRoutes = require("./routes/timetable");
const subjectsRoutes = require("./routes/subjects");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const db = require("./db");
const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));

// test route
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
  });
});

// start server
db.query("SELECT 1")
  .then(() => console.log("✅ MySQL connected"))
  .catch((err) => console.error("❌ MySQL error:", err));
   app.use("/api/auth", authRoutes);
   app.use("/api/courses", coursesRoutes);
   app.use("/api/rooms", roomsRoutes);
   app.use("/api/timetable", timetableRoutes);
   app.use("/api/subjects", subjectsRoutes);
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
