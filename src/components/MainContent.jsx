import React, { useState } from 'react'
import StudentLoggingView from './StudentLoggingView'
import LogTimeline from './LogTimeline'
import RecentActivity from './RecentActivity'
import InsightsModal from './InsightsModal'
import Analytics from './Analytics'

function MainContent({ student, onAddLog, onDeleteLog, onEditLog }) {
  // State management for AI Insights Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState(null)
  
  // Tab state for switching between logging and analytics
  const [activeTab, setActiveTab] = useState('logging')

  // Handler function for AI insights
  const handleGetInsights = async () => {
    setIsModalOpen(true)
    setIsLoading(true)
    setError(null)
    setAiResponse('')

    // Create detailed prompt
    const prompt = `You are an expert teaching assistant specializing in neurodiversity. Analyze the following student log data and provide three brief, actionable insights for the teacher. Look for patterns, potential triggers, and correlations between sensory inputs and feelings.

Student: ${student.name}

Log Data:
${student.logs.map(log => {
  if (log.type === 'feeling') {
    return `- ${log.timestamp}: Feeling - ${log.value}${log.notes ? `, Notes: ${log.notes}` : ''}${log.description ? `, Description: ${log.description}` : ''}`
  } else if (log.type === 'sensory') {
    return `- ${log.timestamp}: Sensory - ${log.category || log.value}${log.intensity ? ` (Intensity: ${log.intensity})` : ''}${log.notes ? `, Notes: ${log.notes}` : ''}${log.description ? `, Description: ${log.description}` : ''}`
  }
  return `- ${log.timestamp}: ${log.type} - ${log.value}`
}).join('\n')}

Please provide:
1. Three brief, actionable insights based on the patterns you observe
2. Potential environmental or sensory triggers to be aware of
3. Specific strategies or accommodations that might help this student

Keep your response concise and practical for a busy teacher.`

    try {
      // Use environment variable for API key - more secure approach
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
      
      if (!API_KEY) {
        throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable. Get your API key from https://makersuite.google.com/app/apikey')
      }

      // Check if there are any logs to analyze
      if (!student.logs || student.logs.length === 0) {
        throw new Error('No logs available for this student. Please add some logs first.')
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        if (response.status === 400) {
          throw new Error('Invalid API key or request. Please check your Gemini API key.')
        } else if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.')
        } else {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text
        setAiResponse(text)
      } else if (data.error) {
        throw new Error(data.error.message || 'API error occurred')
      } else {
        throw new Error('Unexpected response format from API')
      }
    } catch (err) {
      console.error('Error getting AI insights:', err)
      setError(err.message || 'Failed to get AI insights. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('logging')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'logging'
              ? 'text-white border-b-2 border-[var(--accent-gradient-start)]'
              : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Logging
          </div>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-white border-b-2 border-[var(--accent-gradient-start)]'
              : 'text-[var(--text-secondary)] hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </div>
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'logging' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StudentLoggingView onAddLog={onAddLog} />
            </div>
            <div>
              <LogTimeline
                logs={student.logs}
                onDeleteLog={onDeleteLog}
                onEditLog={onEditLog}
              />
            </div>
          </div>
          
          <RecentActivity logs={student.logs} />
          
          <div className="mt-8">
            <button
              onClick={handleGetInsights}
              className="w-full text-lg font-bold text-white py-4 px-6 rounded-lg bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] hover:from-[var(--accent-gradient-start)]/90 hover:to-[var(--accent-gradient-end)]/90 transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50">
              Get Gemini AI Insights
            </button>
          </div>
        </>
      ) : (
        <Analytics logs={student.logs} studentName={student.name} />
      )}

      {/* AI Insights Modal */}
      <InsightsModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        response={aiResponse}
        error={error}
        onClose={() => {
          setIsModalOpen(false)
          setError(null)
          setAiResponse('')
        }}
      />
    </main>
  )
}

export default MainContent
