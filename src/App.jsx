import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

function App() {
  // Initialize students with sample data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Liam Carter',
      logs: [
        {
          id: 1720862400000,
          type: 'feeling',
          value: 'Happy',
          sensory: 'Auditory - Medium',
          timestamp: '10:30 AM'
        },
        {
          id: 1720858500000,
          type: 'sensory',
          value: 'Visual - Low',
          description: 'Dimmed the lights',
          timestamp: '09:15 AM'
        },
        {
          id: 1720776000000,
          type: 'feeling',
          value: 'Anxious',
          description: 'Loud noise from outside',
          timestamp: 'Yesterday'
        },
        {
          id: 1720775000000,
          type: 'sensory',
          value: 'Tactile - High',
          description: 'Used weighted blanket',
          timestamp: 'Yesterday'
        },
        {
          id: 1720689600000,
          type: 'feeling',
          value: 'Sad',
          description: 'Missed a friend',
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
  ])

  const [selectedStudentId, setSelectedStudentId] = useState(1)

  // Master function to add logs
  const handleAddLog = (newLog) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            logs: [newLog, ...student.logs]
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
      id: Date.now(),
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
      />
    </div>
  )
}

export default App
