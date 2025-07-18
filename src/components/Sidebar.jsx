import React, { useState } from 'react'
import DeleteConfirmationModal from './DeleteConfirmationModal'

/**
 * Sidebar component for student selection and addition.
 * Displays list of students and form to add new ones.
 * @param {Object} props - Component props
 * @param {Array} props.students - List of student objects
 * @param {number} props.selectedStudentId - ID of currently selected student
 * @param {Function} props.onSelectStudent - Callback to select a student
 * @param {Function} props.onAddStudent - Callback to add a new student
 */
function Sidebar({ students, selectedStudentId, onSelectStudent, onAddStudent, onDeleteStudent, onEditStudent }) {
  // State for new student name input
  const [newStudentName, setNewStudentName] = useState('')
  // State for editing student
  const [editingStudentId, setEditingStudentId] = useState(null)
  const [editingStudentName, setEditingStudentName] = useState('')
  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  // Handler for submitting new student form
  const handleSubmit = (e) => {
    e.preventDefault()
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim())
      setNewStudentName('')
    }
  }

  // Handler for starting to edit a student
  const handleStartEdit = (student) => {
    setEditingStudentId(student.id)
    setEditingStudentName(student.name)
  }

  // Handler for saving edited student name
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (editingStudentName.trim() && editingStudentName !== students.find(s => s.id === editingStudentId)?.name) {
      onEditStudent(editingStudentId, editingStudentName.trim())
      setEditingStudentId(null)
      setEditingStudentName('')
    }
  }

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditingStudentId(null)
    setEditingStudentName('')
  }

  // Handler for opening the delete confirmation modal
  const handleOpenDeleteModal = (student) => {
    setStudentToDelete(student)
    setIsDeleteModalOpen(true)
  }

  // Handler for closing the delete confirmation modal
  const handleCloseDeleteModal = () => {
    setStudentToDelete(null)
    setIsDeleteModalOpen(false)
  }

  // Handler for confirming deletion
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete.id)
      handleCloseDeleteModal()
    }
  }

  return (
    <>
      <aside className="w-64 bg-[var(--sidebar-background)] p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10 text-white">Dashboard</h1>
          <nav className="space-y-2">
            {students.map(student => (
              <div key={student.id} className="group relative">
                {editingStudentId === student.id ? (
                  <form onSubmit={handleSaveEdit} className="flex gap-2">
                    <input
                      type="text"
                      value={editingStudentName}
                      onChange={(e) => setEditingStudentName(e.target.value)}
                      className="flex-1 bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-gradient-start)]"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-2 text-green-400 hover:text-green-300"
                      title="Save"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-2 text-gray-400 hover:text-gray-300"
                      title="Cancel"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <>
                    <button
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
                    {/* Edit and Delete buttons */}
                    <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${
                      student.id === selectedStudentId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(student)
                        }}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="Edit student name"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDeleteModal(student)
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                        title="Delete student"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
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
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        studentName={studentToDelete?.name}
      />
    </>
  )
}

export default Sidebar
