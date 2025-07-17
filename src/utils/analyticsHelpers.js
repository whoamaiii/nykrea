import { startOfDay, startOfWeek, startOfMonth, format, subDays, eachDayOfInterval, eachHourOfInterval, startOfHour, endOfDay } from 'date-fns'

// Mood distribution for pie chart
export const getMoodDistribution = (logs) => {
  if (!logs || !Array.isArray(logs)) {
    return []
  }
  
  const moodCounts = logs
    .filter(log => log && log.type === 'feeling' && log.value)
    .reduce((acc, log) => {
      acc[log.value] = (acc[log.value] || 0) + 1
      return acc
    }, {})

  const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0)
  
  return Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
  }))
}

// Mood trends over time for line chart
export const getMoodTrends = (logs, days = 7) => {
  if (!logs || !Array.isArray(logs)) {
    return []
  }
  
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)
  const dates = eachDayOfInterval({ start: startDate, end: endDate })
  
  const moodsByDay = dates.map(date => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    const dayLogs = logs.filter(log => {
      if (!log || !log.id || log.type !== 'feeling') return false
      try {
        const logDate = new Date(log.id)
        return !isNaN(logDate.getTime()) && logDate >= dayStart && logDate <= dayEnd
      } catch (error) {
        console.error('Invalid log date:', log.id)
        return false
      }
    })
    
    const moodCounts = dayLogs.reduce((acc, log) => {
      if (log.value) {
        acc[log.value] = (acc[log.value] || 0) + 1
      }
      return acc
    }, {})
    
    return {
      date: format(date, 'MMM d'),
      fullDate: date,
      ...moodCounts,
      total: dayLogs.length
    }
  })
  
  return moodsByDay
}

// Time of day analysis
export const getTimeOfDayAnalysis = (logs) => {
  if (!logs || !Array.isArray(logs)) {
    return []
  }
  
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const moodsByHour = hours.map(hour => {
    const hourLogs = logs.filter(log => {
      if (!log || !log.id || log.type !== 'feeling') return false
      try {
        const logDate = new Date(log.id)
        return !isNaN(logDate.getTime()) && logDate.getHours() === hour
      } catch (error) {
        console.error('Invalid log date:', log.id)
        return false
      }
    })
    
    const moodCounts = hourLogs.reduce((acc, log) => {
      if (log.value) {
        acc[log.value] = (acc[log.value] || 0) + 1
      }
      return acc
    }, {})
    
    return {
      hour: format(new Date().setHours(hour, 0, 0, 0), 'ha'),
      hourNum: hour,
      ...moodCounts,
      total: hourLogs.length
    }
  })
  
  return moodsByHour.filter(h => h.total > 0)
}

// Sensory intensity data for heatmap
export const getSensoryIntensityData = (logs, days = 7) => {
  if (!logs || !Array.isArray(logs)) {
    return []
  }
  
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)
  const dates = eachDayOfInterval({ start: startDate, end: endDate })
  
  const sensoryCategories = ['Visual', 'Auditory', 'Tactile']
  const intensityValues = { 'Low': 1, 'Medium': 2, 'High': 3 }
  
  const heatmapData = []
  
  dates.forEach(date => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    sensoryCategories.forEach(category => {
      const dayLogs = logs.filter(log => {
        if (!log || !log.id || log.type !== 'sensory' || !log.category) return false
        try {
          const logDate = new Date(log.id)
          return !isNaN(logDate.getTime()) && 
                 log.category === category && 
                 logDate >= dayStart && 
                 logDate <= dayEnd
        } catch (error) {
          console.error('Invalid log date:', log.id)
          return false
        }
      })
      
      const avgIntensity = dayLogs.length > 0
        ? dayLogs.reduce((sum, log) => sum + (intensityValues[log.intensity] || 0), 0) / dayLogs.length
        : 0
      
      heatmapData.push({
        date: format(date, 'MMM d'),
        category,
        intensity: avgIntensity,
        count: dayLogs.length
      })
    })
  })
  
  return heatmapData
}

// Correlation analysis between sensory and mood
export const getSensoryMoodCorrelation = (logs) => {
  if (!logs || !Array.isArray(logs)) {
    return []
  }
  
  const correlations = []
  const sensoryCategories = ['Visual', 'Auditory', 'Tactile']
  const moods = ['Happy', 'Sad', 'Angry', 'Anxious']
  
  sensoryCategories.forEach(category => {
    moods.forEach(mood => {
      // Find sensory logs followed by mood logs within 2 hours
      let correlationCount = 0
      
      logs.forEach((log, index) => {
        if (!log || !log.id || !log.type || !log.category) return
        
        if (log.type === 'sensory' && log.category === category) {
          try {
            // Look for mood logs within next 2 hours
            const logTime = new Date(log.id)
            if (isNaN(logTime.getTime())) return
            
            const twoHoursLater = new Date(logTime.getTime() + 2 * 60 * 60 * 1000)
            
            for (let i = index + 1; i < logs.length; i++) {
              const nextLog = logs[i]
              if (!nextLog || !nextLog.id || !nextLog.type) continue
              
              try {
                const nextLogTime = new Date(nextLog.id)
                if (isNaN(nextLogTime.getTime())) continue
                
                if (nextLogTime > twoHoursLater) break
                
                if (nextLog.type === 'feeling' && nextLog.value === mood) {
                  correlationCount++
                  break
                }
              } catch (error) {
                console.error('Error processing next log:', error)
                continue
              }
            }
          } catch (error) {
            console.error('Error processing log time:', error)
            return
          }
        }
      })
      
      correlations.push({
        sensory: category,
        mood,
        count: correlationCount
      })
    })
  })
  
  return correlations.filter(c => c.count > 0)
}

// Quick stats for dashboard
export const getQuickStats = (logs) => {
  if (!logs || !Array.isArray(logs)) {
    return {
      todayTotal: 0,
      todayMoodCount: 0,
      todaySensoryCount: 0,
      mostCommonMoodToday: 'None',
      weekTotal: 0,
      weekMoodBreakdown: {}
    }
  }
  
  const today = new Date()
  const todayStart = startOfDay(today)
  const weekStart = startOfWeek(today)
  
  const todayLogs = logs.filter(log => {
    if (!log || !log.id) return false
    try {
      const logDate = new Date(log.id)
      return !isNaN(logDate.getTime()) && logDate >= todayStart
    } catch (error) {
      console.error('Invalid log date:', log.id)
      return false
    }
  })
  
  const weekLogs = logs.filter(log => {
    if (!log || !log.id) return false
    try {
      const logDate = new Date(log.id)
      return !isNaN(logDate.getTime()) && logDate >= weekStart
    } catch (error) {
      console.error('Invalid log date:', log.id)
      return false
    }
  })
  
  const todayMoods = todayLogs.filter(log => log.type === 'feeling' && log.value)
  const weekMoods = weekLogs.filter(log => log.type === 'feeling' && log.value)
  
  // Most common mood today
  const todayMoodCounts = todayMoods.reduce((acc, log) => {
    if (log.value) {
      acc[log.value] = (acc[log.value] || 0) + 1
    }
    return acc
  }, {})
  
  const mostCommonMoodToday = Object.entries(todayMoodCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  // Week trend
  const weekMoodCounts = weekMoods.reduce((acc, log) => {
    if (log.value) {
      acc[log.value] = (acc[log.value] || 0) + 1
    }
    return acc
  }, {})
  
  return {
    todayTotal: todayLogs.length,
    todayMoodCount: todayMoods.length,
    todaySensoryCount: todayLogs.filter(log => log.type === 'sensory').length,
    mostCommonMoodToday: mostCommonMoodToday ? mostCommonMoodToday[0] : 'None',
    weekTotal: weekLogs.length,
    weekMoodBreakdown: weekMoodCounts
  }
}

// Pattern detection for alerts
export const detectPatterns = (logs) => {
  const alerts = []
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  
  // Check for multiple anxious/angry logs in past 2 hours
  const recentNegativeMoods = logs.filter(log => {
    const logTime = new Date(log.id)
    return log.type === 'feeling' && 
           (log.value === 'Anxious' || log.value === 'Angry') &&
           logTime >= twoHoursAgo
  })
  
  if (recentNegativeMoods.length >= 3) {
    alerts.push({
      type: 'warning',
      message: `${recentNegativeMoods.length} anxious/angry logs in the past 2 hours`,
      timestamp: new Date()
    })
  }
  
  // Check for high sensory intensity patterns
  const recentHighSensory = logs.filter(log => {
    const logTime = new Date(log.id)
    return log.type === 'sensory' && 
           log.intensity === 'High' &&
           logTime >= twoHoursAgo
  })
  
  if (recentHighSensory.length >= 2) {
    alerts.push({
      type: 'info',
      message: `Multiple high sensory intensity logs detected`,
      timestamp: new Date()
    })
  }
  
  return alerts
}

// Filter logs by date range
export const filterLogsByDateRange = (logs, startDate, endDate) => {
  return logs.filter(log => {
    const logDate = new Date(log.id)
    return logDate >= startDate && logDate <= endDate
  })
}

// Get mood colors for consistency
export const getMoodColor = (mood) => {
  const colors = {
    Happy: '#10b981',    // green-500
    Sad: '#8b5cf6',     // purple-500
    Angry: '#ef4444',   // red-500
    Anxious: '#f59e0b', // yellow-500
  }
  return colors[mood] || '#6b7280'
}

// Get sensory colors
export const getSensoryColor = (category) => {
  const colors = {
    Visual: '#3b82f6',   // blue-500
    Auditory: '#ec4899', // pink-500
    Tactile: '#14b8a6'   // teal-500
  }
  return colors[category] || '#6b7280'
}