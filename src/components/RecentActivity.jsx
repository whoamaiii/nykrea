import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

/**
 * Component to display the most recent student activity logs.
 * Shows up to 3 recent logs with colored feelings.
 * @param {Object} props - Component props
 * @param {Array} props.logs - Array of log objects
 */
function RecentActivity({ logs }) {
  // Select the first 3 logs for display
  const recentLogs = logs.slice(0, 3)

  // Get color class based on feeling value
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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}

export default RecentActivity
