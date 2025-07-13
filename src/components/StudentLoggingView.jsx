import React, { useState } from 'react'

function StudentLoggingView({ onAddLog }) {
  const [sensoryInputs, setSensoryInputs] = useState({
    Visual: { intensity: null, notes: '' },
    Auditory: { intensity: null, notes: '' },
    Tactile: { intensity: null, notes: '' }
  })

  const handleFeelingClick = (feeling) => {
    const newLog = {
      id: Date.now(),
      type: 'feeling',
      value: feeling,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    }
    onAddLog(newLog)
  }

  const handleIntensityChange = (category, intensity) => {
    setSensoryInputs({
      ...sensoryInputs,
      [category]: {
        ...sensoryInputs[category],
        intensity: intensity
      }
    })
  }

  const handleLogSensory = (category) => {
    if (!sensoryInputs[category].intensity) return;
    
    const newLog = {
      id: Date.now(),
      type: 'sensory',
      category: category,
      intensity: sensoryInputs[category].intensity,
      notes: sensoryInputs[category].notes,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    }
    
    onAddLog(newLog)
    
    // Reset the intensity and notes for this category
    setSensoryInputs({
      ...sensoryInputs,
      [category]: {
        intensity: null,
        notes: ''
      }
    })
  }

  const handleNotesChange = (category, notes) => {
    setSensoryInputs({
      ...sensoryInputs,
      [category]: {
        ...sensoryInputs[category],
        notes: notes
      }
    })
  }

  return (
    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-2xl border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-4 text-white">Student Logging View</h3>
      <div className="space-y-6">
        <div>
          <label className="text-lg font-medium text-[var(--text-secondary)] mb-3 block">
            How are you feeling?
          </label>
          <div className="flex justify-around items-center p-4 bg-gray-900/70 rounded-lg">
            <button 
              onClick={() => handleFeelingClick('Happy')}
              className="emotion-icon hover:bg-gradient-to-r hover:from-[var(--accent-gradient-start)] hover:to-[var(--accent-gradient-end)] hover:text-white"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.5.5 0 01.707 0 6 6 0 01-7.071 0 .5.5 0 01.707-.707 5 5 0 005.657 0 .5.5 0 01.707.707z" fillRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Happy</span>
            </button>
            <button 
              onClick={() => handleFeelingClick('Sad')}
              className="emotion-icon hover:bg-gradient-to-r hover:from-[var(--accent-gradient-start)] hover:to-[var(--accent-gradient-end)] hover:text-white"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.843 6.472a.5.5 0 00.638.76 6.002 6.002 0 006.41 0 .5.5 0 00.638-.761 5.002 5.002 0 01-7.686 0z" fillRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Sad</span>
            </button>
            <button 
              onClick={() => handleFeelingClick('Angry')}
              className="emotion-icon hover:bg-gradient-to-r hover:from-[var(--accent-gradient-start)] hover:to-[var(--accent-gradient-end)] hover:text-white"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 14a4 4 0 00-4 4h8a4 4 0 00-4-4z" fillRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Angry</span>
            </button>
            <button 
              onClick={() => handleFeelingClick('Anxious')}
              className="emotion-icon hover:bg-gradient-to-r hover:from-[var(--accent-gradient-start)] hover:to-[var(--accent-gradient-end)] hover:text-white"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-5 4a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1z" fillRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">Anxious</span>
            </button>
          </div>
        </div>
        <div>
          <label className="text-lg font-medium text-[var(--text-secondary)] mb-3 block">
            Sensory Input
          </label>
          <div className="space-y-4">
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Visual</h4>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleIntensityChange('Visual', 'Low')}
                  className={`intensity-btn ${sensoryInputs.Visual.intensity === 'Low' ? 'selected' : ''}`}
                >
                  Low
                </button>
                <button 
                  onClick={() => handleIntensityChange('Visual', 'Medium')}
                  className={`intensity-btn ${sensoryInputs.Visual.intensity === 'Medium' ? 'selected' : ''}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => handleIntensityChange('Visual', 'High')}
                  className={`intensity-btn ${sensoryInputs.Visual.intensity === 'High' ? 'selected' : ''}`}
                >
                  High
                </button>
                <input 
                  className="flex-[2] bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-gradient-start)]" 
                  placeholder="Brief description..." 
                  type="text"
                  value={sensoryInputs.Visual.notes}
                  onChange={(e) => handleNotesChange('Visual', e.target.value)}
                />
                <button
                  onClick={() => handleLogSensory('Visual')}
                  disabled={!sensoryInputs.Visual.intensity}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white hover:opacity-90"
                >
                  Log
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Auditory</h4>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleIntensityChange('Auditory', 'Low')}
                  className={`intensity-btn ${sensoryInputs.Auditory.intensity === 'Low' ? 'selected' : ''}`}
                >
                  Low
                </button>
                <button 
                  onClick={() => handleIntensityChange('Auditory', 'Medium')}
                  className={`intensity-btn ${sensoryInputs.Auditory.intensity === 'Medium' ? 'selected' : ''}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => handleIntensityChange('Auditory', 'High')}
                  className={`intensity-btn ${sensoryInputs.Auditory.intensity === 'High' ? 'selected' : ''}`}
                >
                  High
                </button>
                <input 
                  className="flex-[2] bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-gradient-start)]" 
                  placeholder="Brief description..." 
                  type="text"
                  value={sensoryInputs.Auditory.notes}
                  onChange={(e) => handleNotesChange('Auditory', e.target.value)}
                />
                <button
                  onClick={() => handleLogSensory('Auditory')}
                  disabled={!sensoryInputs.Auditory.intensity}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white hover:opacity-90"
                >
                  Log
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-900/70 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Tactile</h4>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleIntensityChange('Tactile', 'Low')}
                  className={`intensity-btn ${sensoryInputs.Tactile.intensity === 'Low' ? 'selected' : ''}`}
                >
                  Low
                </button>
                <button 
                  onClick={() => handleIntensityChange('Tactile', 'Medium')}
                  className={`intensity-btn ${sensoryInputs.Tactile.intensity === 'Medium' ? 'selected' : ''}`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => handleIntensityChange('Tactile', 'High')}
                  className={`intensity-btn ${sensoryInputs.Tactile.intensity === 'High' ? 'selected' : ''}`}
                >
                  High
                </button>
                <input 
                  className="flex-[2] bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[var(--accent-gradient-start)]" 
                  placeholder="Brief description..." 
                  type="text"
                  value={sensoryInputs.Tactile.notes}
                  onChange={(e) => handleNotesChange('Tactile', e.target.value)}
                />
                <button
                  onClick={() => handleLogSensory('Tactile')}
                  disabled={!sensoryInputs.Tactile.intensity}
                  className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white hover:opacity-90"
                >
                  Log
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLoggingView
