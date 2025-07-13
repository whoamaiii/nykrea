import React, { useState } from 'react'
import StudentLoggingView from './StudentLoggingView'
import LogTimeline from './LogTimeline'
import RecentActivity from './RecentActivity'
import InsightsModal from './InsightsModal'

function MainContent({ student, onAddLog, onDeleteLog, onEditLog }) {
  // State management for AI Insights Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [error, setError] = useState(null)

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
      // WARNING: API key is hardcoded for POC only - DO NOT USE IN PRODUCTION
      const API_KEY = 'AIzaSyCHlUphzuYLfs4TXJpftQuTDH1aBQ17rDA' // Replace with your actual API key
      
      if (API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error('Please add your Gemini API key in MainContent.jsx (line 45). Get your API key from https://makersuite.google.com/app/apikey')
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
