const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Database setup
const db = new sqlite3.Database("./notes.db")

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT
    )
  `)
})

// GET all notes
app.get("/notes", (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) return res.status(500).json(err)
    res.json(rows)
  })
})

// POST create note
app.post("/notes", (req, res) => {
  const { title, content } = req.body
  db.run(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) return res.status(500).json(err)
      res.json({ id: this.lastID })
    }
  )
})

// PUT update note
app.put("/notes/:id", (req, res) => {
  const { title, content } = req.body
  const { id } = req.params

  db.run(
    "UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, id],
    function (err) {
      if (err) return res.status(500).json(err)
      res.json({ message: "Updated" })
    }
  )
})

// DELETE note
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params

  db.run("DELETE FROM notes WHERE id=?", id, function (err) {
    if (err) return res.status(500).json(err)
    res.json({ message: "Deleted" })
  })
})

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})