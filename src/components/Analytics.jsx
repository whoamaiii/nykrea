import React, { useState, useMemo } from 'react'
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { format, startOfDay, endOfDay, subDays } from 'date-fns'
import {
  getMoodDistribution,
  getMoodTrends,
  getTimeOfDayAnalysis,
  getSensoryIntensityData,
  getSensoryMoodCorrelation,
  getQuickStats,
  detectPatterns,
  filterLogsByDateRange,
  getMoodColor,
  getSensoryColor
} from '../utils/analyticsHelpers'

function Analytics({ logs, studentName }) {
  const [dateRange, setDateRange] = useState(7) // Default to 7 days
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, print
  
  // Filter logs based on date range
  const filteredLogs = useMemo(() => {
    const endDate = new Date()
    const startDate = subDays(endDate, dateRange - 1)
    return filterLogsByDateRange(logs, startOfDay(startDate), endOfDay(endDate))
  }, [logs, dateRange])
  
  // Calculate all analytics data
  const moodDistribution = useMemo(() => getMoodDistribution(filteredLogs), [filteredLogs])
  const moodTrends = useMemo(() => getMoodTrends(filteredLogs, dateRange), [filteredLogs, dateRange])
  const timeOfDayData = useMemo(() => getTimeOfDayAnalysis(filteredLogs), [filteredLogs])
  const sensoryData = useMemo(() => getSensoryIntensityData(filteredLogs, dateRange), [filteredLogs, dateRange])
  const correlations = useMemo(() => getSensoryMoodCorrelation(filteredLogs), [filteredLogs])
  const quickStats = useMemo(() => getQuickStats(logs), [logs])
  const patterns = useMemo(() => detectPatterns(logs), [logs])
  
  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  // Render pattern alerts
  const renderAlerts = () => {
    if (patterns.length === 0) return null
    
    return (
      <div className="mb-6 space-y-2">
        {patterns.map((alert, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              alert.type === 'warning' 
                ? 'bg-red-900/20 border-red-700 text-red-400' 
                : 'bg-blue-900/20 border-blue-700 text-blue-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{alert.message}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  // Quick stats cards
  const renderQuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-[var(--card-background)] rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Today's Logs</h4>
        <p className="text-3xl font-bold text-white">{quickStats.todayTotal}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {quickStats.todayMoodCount} moods, {quickStats.todaySensoryCount} sensory
        </p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Most Common Today</h4>
        <p className="text-3xl font-bold" style={{ color: getMoodColor(quickStats.mostCommonMoodToday) }}>
          {quickStats.mostCommonMoodToday}
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Primary mood</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Week Total</h4>
        <p className="text-3xl font-bold text-white">{quickStats.weekTotal}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Last 7 days</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-xl p-6 border border-gray-700/50">
        <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Active Alerts</h4>
        <p className="text-3xl font-bold text-yellow-400">{patterns.length}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Requires attention</p>
      </div>
    </div>
  )
  
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-[var(--card-background)] rounded-2xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
        <p className="text-[var(--text-secondary)]">Start logging student activities to see analytics</p>
      </div>
    )
  }
  
  return (
    <div className={viewMode === 'print' ? 'print:block' : ''}>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Analytics Dashboard</h3>
          <p className="text-[var(--text-secondary)]">{studentName}'s behavioral patterns and insights</p>
        </div>
        
        <div className="flex gap-3">
          {/* Date range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-gradient-start)]"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          {/* View mode selector */}
          <div className="flex bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'overview' 
                  ? 'bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'detailed' 
                  ? 'bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setViewMode('print')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'print' 
                  ? 'bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Print
            </button>
          </div>
        </div>
      </div>
      
      {/* Alerts */}
      {renderAlerts()}
      
      {/* Quick Stats */}
      {(viewMode === 'overview' || viewMode === 'print') && renderQuickStats()}
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution Pie Chart */}
        {(viewMode === 'overview' || viewMode === 'print') && moodDistribution.length > 0 && (
          <div className="bg-[var(--card-background)] rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Mood Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percentage }) => `${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getMoodColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Mood Trends Line Chart */}
        {moodTrends.length > 0 && (
          <div className="bg-[var(--card-background)] rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Mood Trends</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="Happy" stroke={getMoodColor('Happy')} strokeWidth={2} />
                  <Line type="monotone" dataKey="Sad" stroke={getMoodColor('Sad')} strokeWidth={2} />
                  <Line type="monotone" dataKey="Angry" stroke={getMoodColor('Angry')} strokeWidth={2} />
                  <Line type="monotone" dataKey="Anxious" stroke={getMoodColor('Anxious')} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Time of Day Analysis */}
        {viewMode === 'detailed' && timeOfDayData.length > 0 && (
          <div className="bg-[var(--card-background)] rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Time of Day Patterns</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Happy" stackId="a" fill={getMoodColor('Happy')} />
                  <Bar dataKey="Sad" stackId="a" fill={getMoodColor('Sad')} />
                  <Bar dataKey="Angry" stackId="a" fill={getMoodColor('Angry')} />
                  <Bar dataKey="Anxious" stackId="a" fill={getMoodColor('Anxious')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Sensory Intensity Heatmap */}
        {viewMode === 'detailed' && (
          <div className="bg-[var(--card-background)] rounded-2xl p-6 border border-gray-700/50">
            <h4 className="text-lg font-semibold text-white mb-4">Sensory Intensity Patterns</h4>
            <div className="space-y-3">
              {['Visual', 'Auditory', 'Tactile'].map(category => {
                const categoryData = sensoryData.filter(d => d.category === category)
                return (
                  <div key={category} className="space-y-2">
                    <h5 className="text-sm font-medium text-[var(--text-secondary)]">{category}</h5>
                    <div className="flex gap-1">
                      {categoryData.map((day, index) => (
                        <div
                          key={index}
                          className="flex-1 h-8 rounded flex items-center justify-center text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(${
                              category === 'Visual' ? '59, 130, 246' :
                              category === 'Auditory' ? '236, 72, 153' :
                              '20, 184, 166'
                            }, ${day.intensity / 3})`,
                            color: day.intensity > 1.5 ? 'white' : 'rgb(156, 163, 175)'
                          }}
                          title={`${day.date}: ${day.count} logs, avg intensity ${day.intensity.toFixed(1)}`}
                        >
                          {day.count}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Correlation Analysis */}
      {viewMode === 'detailed' && correlations.length > 0 && (
        <div className="mt-6 bg-[var(--card-background)] rounded-2xl p-6 border border-gray-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">Sensory-Mood Correlations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {correlations.map((corr, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getSensoryColor(corr.sensory) }}
                  />
                  <span className="text-sm text-white">{corr.sensory}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: getMoodColor(corr.mood) }}>
                    {corr.mood}
                  </span>
                </div>
                <span className="text-sm font-bold text-white">{corr.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Print Mode Summary */}
      {viewMode === 'print' && (
        <div className="mt-8 p-6 border-t border-gray-700 print:break-before-page">
          <h4 className="text-lg font-semibold text-white mb-4">Summary Report</h4>
          <div className="prose prose-invert max-w-none">
            <p className="text-sm text-[var(--text-secondary)]">
              Generated on: {format(new Date(), 'MMMM d, yyyy h:mm a')}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              This report covers {studentName}'s emotional and sensory data for the past {dateRange} days.
              Total logs analyzed: {filteredLogs.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics