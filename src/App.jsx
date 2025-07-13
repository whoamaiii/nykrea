import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

// Generate unique IDs to prevent collisions
let idCounter = Date.now()
const generateUniqueId = () => {
  return ++idCounter
}

// Initial demo data
const initialStudents = [
  {
    id: 1,
    name: 'Liam Carter',
    logs: [
      {
        id: generateUniqueId(),
        type: 'feeling',
        value: 'Happy',
        sensory: 'Auditory - Medium',
        timestamp: '10:30 AM'
      },
      {
        id: generateUniqueId(),
        type: 'sensory',
        value: 'Visual - Low',
        notes: 'Dimmed the lights',
        timestamp: '09:15 AM'
      },
      {
        id: generateUniqueId(),
        type: 'feeling',
        value: 'Anxious',
        notes: 'Loud noise from outside',
        timestamp: 'Yesterday'
      },
      {
        id: generateUniqueId(),
        type: 'sensory',
        value: 'Tactile - High',
        notes: 'Used weighted blanket',
        timestamp: 'Yesterday'
      },
      {
        id: generateUniqueId(),
        type: 'feeling',
        value: 'Sad',
        notes: 'Missed a friend',
        timestamp: '2 days ago'
      }
    ]
  },
  {
    id: 2,
    name: 'Olivia Bennett',
    logs: []
  },
  {
    id: 3,
    name: 'Noah Thompson',
    logs: []
  },
  {
    id: 4,
    name: 'Ava Rodriguez',
    logs: []
  },
  {
    id: 5,
    name: 'Ethan Walker',
    logs: []
  }
]

function App() {
  // Initialize students from localStorage or fall back to demo data
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('kre-students')
    if (savedStudents) {
      try {
        return JSON.parse(savedStudents)
      } catch (error) {
        console.error('Error loading saved data:', error)
        return initialStudents
      }
    }
    return initialStudents
  })

  const [selectedStudentId, setSelectedStudentId] = useState(1)

  // Save to localStorage whenever students state changes
  useEffect(() => {
    console.log("STATE UPDATED:", students);
    localStorage.setItem('kre-students', JSON.stringify(students))
  }, [students]);

  // Master function to add logs
  const handleAddLog = (newLog) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            logs: [{...newLog, id: generateUniqueId()}, ...student.logs]
          }
        }
        return student
      })
    })
  }

  // Function to delete a log
  const handleDeleteLog = (logId) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            logs: student.logs.filter(log => log.id !== logId)
          }
        }
        return student
      })
    })
  }

  // Function to edit a log
  const handleEditLog = (logId, updatedLog) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            logs: student.logs.map(log => 
              log.id === logId ? { ...log, ...updatedLog } : log
            )
          }
        }
        return student
      })
    })
  }

  // Get selected student
  const selectedStudent = students.find(s => s.id === selectedStudentId)

  // Function to add new student
  const handleAddStudent = (name) => {
    const newStudent = {
      id: generateUniqueId(),
      name: name,
      logs: []
    }
    setStudents([...students, newStudent])
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={setSelectedStudentId}
        onAddStudent={handleAddStudent}
      />
      <MainContent 
        student={selectedStudent}
        onAddLog={handleAddLog}
        onDeleteLog={handleDeleteLog}
        onEditLog={handleEditLog}
      />
    </div>
  )
}

export default App
