import React, { useState } from 'react'

function LogTimeline({ logs, onDeleteLog, onEditLog }) {
  const [editingLogId, setEditingLogId] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  // Format timestamp to show full date and time
  const formatTimestamp = (timestamp) => {
    try {
      // Handle both timestamp numbers and date objects
      const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
      
      if (diffDays === 0) {
        return `Today at ${timeStr}`
      } else if (diffDays === 1) {
        return `Yesterday at ${timeStr}`
      } else if (diffDays < 7) {
        return `${diffDays} days ago at ${timeStr}`
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        }) + ` at ${timeStr}`
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error)
      return 'Invalid date'
    }
  }

  const handleEditClick = (log) => {
    setEditingLogId(log.id)
    setEditFormData({
      value: log.value,
      notes: log.notes || log.description || '',
      category: log.category || '',
      intensity: log.intensity || ''
    })
  }

  const handleSaveEdit = (logId) => {
    onEditLog(logId, editFormData)
    setEditingLogId(null)
    setEditFormData({})
  }

  const handleCancelEdit = () => {
    setEditingLogId(null)
    setEditFormData({})
  }

  const handleDelete = (logId) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      onDeleteLog(logId)
    }
  }

  const getIcon = (log) => {
    if (log.type === 'feeling') {
      switch (log.value) {
        case 'Happy':
          return (
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a.5.5 0 01.707 0 6 6 0 01-7.071 0 .5.5 0 01.707-.707 5 5 0 005.657 0 .5.5 0 01.707.707z" fillRule="evenodd"></path>
            </svg>
          )
        case 'Sad':
          return (
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.843 6.472a.5.5 0 00.638.76 6.002 6.002 0 006.41 0 .5.5 0 00.638-.761 5.002 5.002 0 01-7.686 0z" fillRule="evenodd"></path>
            </svg>
          )
        case 'Angry':
          return (
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 14a4 4 0 00-4 4h8a4 4 0 00-4-4z" fillRule="evenodd"></path>
            </svg>
          )
        case 'Anxious':
          return (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-5 4a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1z" fillRule="evenodd"></path>
            </svg>
          )
        default:
          return null
      }
    } else {
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
        </svg>
      )
    }
  }

  return (
    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-2xl border border-gray-700/50 flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4 text-white">Log Timeline</h3>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No logs yet</p>
        ) : (
          logs.map((log, index) => (
            <div key={log.id} className={`py-4 ${index < logs.length - 1 ? 'border-b border-gray-700' : ''}`}>
              {editingLogId === log.id ? (
                // Edit mode
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getIcon(log)}
                    <span className="text-sm text-gray-400">
                      {log.type === 'feeling' ? 'Feeling' : 'Sensory'}
                    </span>
                  </div>
                  {log.type === 'feeling' ? (
                    <select 
                      value={editFormData.value} 
                      onChange={(e) => setEditFormData({...editFormData, value: e.target.value})}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                    >
                      <option value="Happy">Happy</option>
                      <option value="Sad">Sad</option>
                      <option value="Angry">Angry</option>
                      <option value="Anxious">Anxious</option>
                    </select>
                  ) : (
                    <>
                      <input 
                        type="text"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                        placeholder="Category"
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                      />
                      <input 
                        type="text"
                        value={editFormData.intensity}
                        onChange={(e) => setEditFormData({...editFormData, intensity: e.target.value})}
                        placeholder="Intensity"
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
                      />
                    </>
                  )}
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                    placeholder="Notes (optional)"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm resize-none"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(log.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="group">
                  <div className="flex items-start gap-3">
                    {getIcon(log)}
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">
                        {log.type === 'feeling' 
                          ? `Feeling: ${log.value}` 
                          : `Sensory: ${log.category || log.value}${log.intensity ? ` - ${log.intensity}` : ''}`}
                      </p>
                      {(log.notes || log.description) && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {log.notes || log.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                        {formatTimestamp(log.id)}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => handleEditClick(log)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Edit log"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Delete log"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LogTimeline
