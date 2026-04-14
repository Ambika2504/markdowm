import React, { useEffect, useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import "./App.css"

const API = "http://localhost:5000"

function App() {
  const [notes, setNotes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // 🌙 Dark Mode State
  const [darkMode, setDarkMode] = useState(false)

  // Fetch notes
  const fetchNotes = async () => {
    const res = await axios.get(`${API}/notes`)
    setNotes(res.data)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // Select note
  const selectNote = (note) => {
    setSelectedId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  // Create note
  const createNote = async () => {
    await axios.post(`${API}/notes`, { title, content })
    fetchNotes()
    setTitle("")
    setContent("")
  }

  // Update note
  const updateNote = async () => {
    if (!selectedId) return
    await axios.put(`${API}/notes/${selectedId}`, { title, content })
    fetchNotes()
  }

  // Delete note
  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`)
    fetchNotes()
    setSelectedId(null)
    setTitle("")
    setContent("")
  }

  return (
    // 🌙 STEP 3: Apply dark class here
    <div className={darkMode ? "app dark" : "app"}>

      {/* 🌙 STEP 2: Toggle Button */}
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Sidebar */}
      <div className="sidebar">
        <h2>Notes</h2>
        <button onClick={createNote}>➕ New</button>

        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h4 onClick={() => selectNote(note)}>{note.title}</h4>
            <button onClick={() => deleteNote(note.id)}>❌</button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="editor">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={updateNote}>💾 Save</button>
      </div>

      {/* Preview */}
      <div className="preview">
        <h3>Preview</h3>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}

export default App