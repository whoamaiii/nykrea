import { startOfDay, startOfWeek, startOfMonth, format, subDays, eachDayOfInterval, eachHourOfInterval, startOfHour, endOfDay } from 'date-fns'

// Helper function to get timestamp from log (handles both old and new formats)
const getLogTimestamp = (log) => {
  // If timestamp exists and is a number, use it
  if (typeof log.timestamp === 'number') {
    return log.timestamp;
  }
  // If timestamp exists and is a string, parse it
  if (typeof log.timestamp === 'string') {
    return new Date(log.timestamp).getTime();
  }
  // Fallback to id (for backward compatibility)
  return typeof log.id === 'number' ? log.id : new Date(log.id).getTime();
}

// Mood distribution for pie chart
export const getMoodDistribution = (logs) => {
  const moodCounts = logs
    .filter(log => log.type === 'feeling')
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
  const endDate = new Date()
  const startDate = subDays(endDate, days - 1)
  const dates = eachDayOfInterval({ start: startDate, end: endDate })
  
  const moodsByDay = dates.map(date => {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    const dayLogs = logs.filter(log => {
      const logDate = new Date(getLogTimestamp(log))
      return log.type === 'feeling' && logDate >= dayStart && logDate <= dayEnd
    })
    
    const moodCounts = dayLogs.reduce((acc, log) => {
      acc[log.value] = (acc[log.value] || 0) + 1
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
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const moodsByHour = hours.map(hour => {
    const hourLogs = logs.filter(log => {
      if (log.type !== 'feeling') return false
      const logDate = new Date(getLogTimestamp(log))
      return logDate.getHours() === hour
    })
    
    const moodCounts = hourLogs.reduce((acc, log) => {
      acc[log.value] = (acc[log.value] || 0) + 1
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
        const logDate = new Date(getLogTimestamp(log))
        return log.type === 'sensory' && 
               log.category === category && 
               logDate >= dayStart && 
               logDate <= dayEnd
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

/**
 * Calculates how often each sensory input category is followed by a particular mood within
 * a two-hour time window.
 *
 * The log array is expected to be in chronological order (oldest → newest). For every sensory
 * event we perform a look-ahead scan until we either reach the end of the log list or step
 * past the two-hour window. If a mood entry matching one of the tracked moods is found inside
 * that window, the corresponding sensory-mood counter is incremented once.
 *
 * Parameters
 * ----------
 * @param {Array<Object>} logs  – List of log objects. Each object combines both *feeling* and
 *                                *sensory* shapes and **must** contain either a `timestamp`
 *                                (number | ISO string) or an `id` that can be coerced into a
 *                                timestamp. The list should already be sorted chronologically
 *                                for the correlation logic to make sense.
 *
 * @returns {Array<{ sensory: string, mood: string, count: number }>}  Array containing an entry
 *          for every sensory × mood pair that occurred at least once within the 2-hour window.
 *
 * @example
 * // Returns something like → [{ sensory: 'Visual', mood: 'Anxious', count: 2 }]
 * const correlations = getSensoryMoodCorrelation(studentLogs);
 */
export const getSensoryMoodCorrelation = (logs) => {
  // Track correlation counts. We build this up incrementally and later
  // filter out the pairs that never occurred.
  const correlations = []
  const sensoryCategories = ['Visual', 'Auditory', 'Tactile']
  const moods = ['Happy', 'Sad', 'Angry', 'Anxious']

  // Iterate over every combination of sensory category and mood we care about.
  sensoryCategories.forEach(category => {
    moods.forEach(mood => {
      // Counter for the current (category, mood) pair.
      let correlationCount = 0

      // Walk the full log list once for each pair. This is O(N * categories * moods)
      // but the data set is small enough that the simplicity is worth the cost.
      logs.forEach((log, index) => {
        if (log.type === 'sensory' && log.category === category) {
          // We found a sensory event – now look forward up to two hours.
          const logTime = new Date(getLogTimestamp(log))
          const twoHoursLater = new Date(logTime.getTime() + 2 * 60 * 60 * 1000)

          // Scan subsequent logs until we leave the 2-hour window.
          for (let i = index + 1; i < logs.length; i++) {
            const nextLog = logs[i]
            const nextLogTime = new Date(getLogTimestamp(nextLog))

            if (nextLogTime > twoHoursLater) break // Outside the window → stop scanning

            // Count the first occurrence of the target mood and move on to the next sensory log.
            if (nextLog.type === 'feeling' && nextLog.value === mood) {
              correlationCount++
              break
            }
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

  // Remove zero-count entries to keep the charting layer tidy.
  return correlations.filter(c => c.count > 0)
}

// Quick stats for dashboard
export const getQuickStats = (logs) => {
  const today = new Date()
  const todayStart = startOfDay(today)
  const weekStart = startOfWeek(today)
  
  const todayLogs = logs.filter(log => new Date(getLogTimestamp(log)) >= todayStart)
  const weekLogs = logs.filter(log => new Date(getLogTimestamp(log)) >= weekStart)
  
  const todayMoods = todayLogs.filter(log => log.type === 'feeling')
  const weekMoods = weekLogs.filter(log => log.type === 'feeling')
  
  // Most common mood today
  const todayMoodCounts = todayMoods.reduce((acc, log) => {
    acc[log.value] = (acc[log.value] || 0) + 1
    return acc
  }, {})
  
  const mostCommonMoodToday = Object.entries(todayMoodCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  // Week trend
  const weekMoodCounts = weekMoods.reduce((acc, log) => {
    acc[log.value] = (acc[log.value] || 0) + 1
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
    const logTime = new Date(getLogTimestamp(log))
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
    const logTime = new Date(getLogTimestamp(log))
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

  // Check for weekly patterns
  const moodsByDayOfWeek = logs.reduce((acc, log) => {
    if (log.type === 'feeling') {
      const day = format(new Date(getLogTimestamp(log)), 'EEEE');
      if (!acc[day]) {
        acc[day] = {};
      }
      if (!acc[day][log.value]) {
        acc[day][log.value] = 0;
      }
      acc[day][log.value]++;
    }
    return acc;
  }, {});

  for (const day in moodsByDayOfWeek) {
    for (const mood in moodsByDayOfWeek[day]) {
      if (moodsByDayOfWeek[day][mood] >= 3) {
        alerts.push({
          type: 'info',
          message: `Student typically feels ${mood} on ${day}s`,
          timestamp: new Date()
        });
      }
    }
  }

  // Check for correlation between high sensory input and negative moods
  logs.forEach((log, index) => {
    if (log.type === 'sensory' && log.intensity === 'High') {
      const logTime = new Date(getLogTimestamp(log));
      const twoHoursLater = new Date(logTime.getTime() + 2 * 60 * 60 * 1000);
      for (let i = index + 1; i < logs.length; i++) {
        const nextLog = logs[i];
        const nextLogTime = new Date(getLogTimestamp(nextLog));
        if (nextLogTime > twoHoursLater) break;
        if (nextLog.type === 'feeling' && (nextLog.value === 'Angry' || nextLog.value === 'Anxious')) {
          alerts.push({
            type: 'warning',
            message: `High ${log.category} input was followed by feeling ${nextLog.value}`,
            timestamp: new Date()
          });
          break;
        }
      }
    }
  });
  
  return alerts
}

// Filter logs by date range
export const filterLogsByDateRange = (logs, startDate, endDate) => {
  return logs.filter(log => {
    const logDate = new Date(getLogTimestamp(log))
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
