const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ranok",
  database: "timetable_portal",
});

module.exports = db;







































