import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import ScheduleSettings from './components/ScheduleSettings'

// Initial demo data
const initialStudents = [
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
]

/**
 * Main application component for the Student Emotional and Sensory Logging System.
 * 
 * This application helps educators track emotional states and sensory experiences
 * for students, particularly those with neurodiversity who may benefit from 
 * understanding patterns in their sensory processing and emotional responses.
 * 
 * The app manages multiple students, each with their own collection of logs that
 * capture feelings (Happy, Sad, Angry, Anxious) and sensory inputs (Visual, 
 * Auditory, Tactile) with intensity levels and environmental context.
 * 
 * Key features:
 * - Persistent data storage using localStorage
 * - Real-time log creation and editing
 * - Student management (add, edit, delete)
 * - Schedule management for each student
 * - Analytics and pattern detection for educational insights
 * 
 * @component
 * @returns {JSX.Element} The main application layout with sidebar and content areas
 * 
 * @example
 * // The App component is typically rendered at the application root
 * return <App />;
 */
function App() {
  // Initialize students from localStorage or fall back to demo data
  // This ensures data persistence across browser sessions while providing
  // sample data for new users to understand the system's capabilities
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

  // Track which student is currently selected for viewing/editing
  // Defaults to the first student (ID: 1) for immediate usability
  const [selectedStudentId, setSelectedStudentId] = useState(1)

  // Persist data to localStorage whenever the students state changes
  // This provides automatic data backup without requiring explicit save actions
  useEffect(() => {
    console.log("STATE UPDATED:", students);
    localStorage.setItem('kre-students', JSON.stringify(students))
  }, [students]);

  /**
   * Adds a new log entry to the currently selected student.
   * 
   * This is the primary data entry point for the application. Logs are prepended
   * to maintain chronological order with newest entries first, which aligns with
   * the typical workflow of reviewing recent emotional/sensory events.
   * 
   * @param {Object} newLog - The log entry to add
   * @param {number} newLog.id - Unique identifier (typically timestamp)
   * @param {string} newLog.type - Log type: 'feeling' or 'sensory'
   * @param {string} newLog.value - Emotion name or sensory description
   * @param {number} newLog.timestamp - When the log was created
   * @param {string} [newLog.description] - Optional additional context
   * @param {string} [newLog.environmentalFactors] - Optional environmental context
   */
  const handleAddLog = (newLog) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            logs: [newLog, ...student.logs] // Prepend to show newest first
          }
        }
        return student
      })
    })
  }

  /**
   * Removes a specific log entry from the currently selected student.
   * 
   * This allows correction of accidental entries or removal of test data.
   * Uses immutable update patterns to ensure React re-renders properly.
   * 
   * @param {number} logId - Unique identifier of the log to delete
   */
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

  /**
   * Updates an existing log entry with new information.
   * 
   * Enables post-creation editing of logs to add context, correct mistakes,
   * or update environmental factors. Maintains log order by ID while allowing
   * content modification.
   * 
   * @param {number} logId - Unique identifier of the log to update  
   * @param {Object} updatedLog - Partial log object containing fields to update
   */
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

  // Get selected student object for passing to child components
  // This derived state ensures components always have current student data
  const selectedStudent = students.find(s => s.id === selectedStudentId)

  /**
   * Creates a new student and adds them to the system.
   * 
   * Generates a unique ID using current timestamp to avoid collisions.
   * New students start with empty logs array, ready for data entry.
   * 
   * @param {string} name - The full name of the new student
   */
  const handleAddStudent = (name) => {
    const newStudent = {
      id: Date.now(), // Simple unique ID generation
      name: name,
      logs: []
    }
    setStudents([...students, newStudent])
  }

  /**
   * Removes a student and all their associated data from the system.
   * 
   * Includes automatic selection handling: if the deleted student was currently
   * selected, switches to the first remaining student to maintain app usability.
   * 
   * @param {number} studentId - Unique identifier of the student to delete
   */
  const handleDeleteStudent = (studentId) => {
    setStudents(prevStudents => {
      const updatedStudents = prevStudents.filter(student => student.id !== studentId);
      // Auto-select first remaining student if deleted student was selected
      // This prevents the app from entering an invalid state
      if (selectedStudentId === studentId) {
        setSelectedStudentId(updatedStudents[0]?.id || null);
      }
      return updatedStudents;
    });
  }

  /**
   * Updates a student's name while preserving all their log data.
   * 
   * Useful for correcting spelling errors or handling name changes.
   * Uses immutable update pattern to ensure proper React re-rendering.
   * 
   * @param {number} studentId - Unique identifier of the student to update
   * @param {string} newName - The updated name for the student
   */
  const handleEditStudent = (studentId, newName) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId ? { ...student, name: newName } : student
      )
    )
  }

  /**
   * Saves schedule information for the currently selected student.
   * 
   * Schedules help educators understand routine patterns and plan interventions
   * based on predictable daily activities that may influence student behavior.
   * 
   * @param {Object} schedule - Schedule data structure containing time-based activities
   */
  const handleSaveSchedule = (schedule) => {
    setStudents(prevStudents => {
      return prevStudents.map(student => {
        if (student.id === selectedStudentId) {
          return {
            ...student,
            schedule: schedule
          }
        }
        return student
      })
    })
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        students={students}
        selectedStudentId={selectedStudentId}
        onSelectStudent={setSelectedStudentId}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        onEditStudent={handleEditStudent}
      />
      <MainContent 
        student={selectedStudent}
        onAddLog={handleAddLog}
        onDeleteLog={handleDeleteLog}
        onEditLog={handleEditLog}
        onSaveSchedule={handleSaveSchedule}
      />
    </div>
  )
}

export default App
