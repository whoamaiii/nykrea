import React from 'react'
import StudentLoggingView from './StudentLoggingView'
import LogTimeline from './LogTimeline'
import RecentActivity from './RecentActivity'

function MainContent({ student, onAddLog }) {
  if (!student) {
    return (
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="text-center text-gray-500 mt-20">
          <p>No student selected</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-10 overflow-y-auto">
      <header className="mb-10">
        <h2 className="text-4xl font-bold text-white">{student.name}'s Well-being</h2>
        <p className="text-lg text-[var(--text-secondary)] mt-1">
          A real-time overview of student wellness and emotional state.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StudentLoggingView onAddLog={onAddLog} />
        </div>
        <div>
          <LogTimeline logs={student.logs} />
        </div>
      </div>
      
      <RecentActivity logs={student.logs} />
      
      <div className="mt-8">
        <button className="w-full text-lg font-bold text-white py-4 px-6 rounded-lg bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] hover:from-[var(--accent-gradient-start)]/90 hover:to-[var(--accent-gradient-end)]/90 transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50">
          Get Gemini AI Insights
        </button>
      </div>
    </main>
  )
}

export default MainContent
