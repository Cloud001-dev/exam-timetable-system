const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

// CREATE USERS TABLE
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  matric TEXT UNIQUE,
  department TEXT,
  level TEXT,
  password TEXT
)
`);

// ================= SIGNUP =================
app.post("/signup", (req, res) => {

  const { name, matric, department, level, password } = req.body;

  db.run(
    `INSERT INTO users (name, matric, department, level, password)
     VALUES (?, ?, ?, ?, ?)`,
    [name, matric, department, level, password],
    function (err) {

      if (err) {
        return res.json({ success:false, message:"User already exists" });
      }

      res.json({ success:true });
    }
  );

});


// ================= LOGIN =================
app.post("/login", (req, res) => {

  const { matric, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE matric=? AND password=?`,
    [matric, password],
    (err, row) => {

      if (row) {
        res.json({ success:true, user:row });
      } else {
        res.json({ success:false });
      }

    }
  );

});


// ================= GET USER =================
app.get("/user/:matric", (req, res) => {

  const matric = req.params.matric;

  db.get(
    `SELECT * FROM users WHERE matric=?`,
    [matric],
    (err, row) => {
      res.json(row);
    }
  );

});


app.listen(PORT, () => {
  console.log("Server running on http://localhost:3000");
});
