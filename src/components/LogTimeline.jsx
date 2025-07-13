import React from 'react'

function LogTimeline({ logs }) {
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
              <div className="flex items-center gap-3">
                {getIcon(log)}
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">
                    {log.type === 'feeling' ? `Feeling: ${log.value}` : `Sensory: ${log.value}`}
                  </p>
                  {log.sensory && (
                    <p className="text-xs text-[var(--text-secondary)]">Sensory: {log.sensory}</p>
                  )}
                  {log.description && (
                    <p className="text-xs text-[var(--text-secondary)]">{log.description}</p>
                  )}
                </div>
                <span className="text-xs text-[var(--text-secondary)] ml-auto whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LogTimeline
