import React from 'react'

function RecentActivity({ logs }) {
  // Get the first 3 logs for recent activity
  const recentLogs = logs.slice(0, 3)

  const getColorClass = (value) => {
    switch (value) {
      case 'Happy': return 'text-green-400'
      case 'Sad': return 'text-purple-400'
      case 'Angry': return 'text-red-400'
      case 'Anxious': return 'text-yellow-400'
      case 'Calm': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="mt-8 bg-[var(--card-background)] rounded-2xl p-6 shadow-2xl border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-6 text-white">Recent Activity Timeline</h3>
      <div className="space-y-4">
        {recentLogs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No recent activity</p>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-white">
                  {log.type === 'feeling' ? (
                    <>
                      Logged Feeling: <span className={`${getColorClass(log.value)} font-semibold`}>{log.value}</span>
                    </>
                  ) : (
                    `Sensory Input: ${log.value}`
                  )}
                </p>
                {(log.description || log.sensory) && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {log.sensory || log.description}
                  </p>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{log.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentActivity
