import React, { useState } from 'react'

function Sidebar({ students, selectedStudentId, onSelectStudent, onAddStudent }) {
  const [newStudentName, setNewStudentName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim())
      setNewStudentName('')
    }
  }

  return (
    <aside className="w-64 bg-[var(--sidebar-background)] p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-white">Dashboard</h1>
        <nav className="space-y-2">
          {students.map(student => (
            <button
              key={student.id}
              onClick={() => onSelectStudent(student.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                student.id === selectedStudentId
                  ? 'bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white shadow-lg'
                  : 'hover:bg-gray-700/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span className="font-medium">{student.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[var(--text-secondary)]" htmlFor="student-name">
            Student Name
          </label>
          <input
            className="w-full bg-[var(--input-background)] border-none rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent-gradient-start)]"
            id="student-name"
            name="student-name"
            placeholder="Enter name"
            type="text"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
          />
          <button
            className="w-full text-white font-semibold py-2 px-4 rounded-md bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] hover:opacity-90 transition-opacity duration-200"
            type="submit"
          >
            Add Student
          </button>
        </form>
      </div>
    </aside>
  )
}

export default Sidebar
