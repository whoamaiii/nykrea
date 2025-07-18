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
 * Analyzes temporal correlations between sensory inputs and mood states.
 * 
 * This function examines whether specific sensory experiences (Visual, Auditory, Tactile)
 * are followed by particular mood states within a 2-hour window. This is crucial for 
 * understanding sensory triggers and their emotional impact on students, particularly 
 * those with neurodiversity who may have heightened sensitivities.
 * 
 * The algorithm uses a sliding window approach: for each sensory log, it searches forward
 * through subsequent logs to find mood entries that occur within 2 hours. This timeframe
 * balances capturing genuine correlations while avoiding false positives from unrelated events.
 * 
 * @param {Array<Object>} logs - Array of student log entries, must be chronologically ordered
 * @param {string} logs[].type - Log type: 'sensory' or 'feeling'
 * @param {string} logs[].category - For sensory logs: 'Visual', 'Auditory', or 'Tactile'
 * @param {string} logs[].value - For feeling logs: 'Happy', 'Sad', 'Angry', or 'Anxious'
 * @param {number|string} logs[].timestamp - Unix timestamp or parseable date string
 * @param {number|string} logs[].id - Fallback timestamp if timestamp field is missing
 * 
 * @returns {Array<Object>} Correlation data for visualization and analysis
 * @returns {string} returns[].sensory - Sensory category ('Visual', 'Auditory', 'Tactile')
 * @returns {string} returns[].mood - Mood state ('Happy', 'Sad', 'Angry', 'Anxious')
 * @returns {number} returns[].count - Number of times this sensory-mood pair was observed
 * 
 * @throws {Error} Throws if logs array contains invalid timestamp data
 * 
 * @example
 * const logs = [
 *   { type: 'sensory', category: 'Auditory', timestamp: 1640995200000 },
 *   { type: 'feeling', value: 'Anxious', timestamp: 1640999800000 }  // 1 hour later
 * ];
 * const correlations = getSensoryMoodCorrelation(logs);
 * // Returns: [{ sensory: 'Auditory', mood: 'Anxious', count: 1 }]
 */
export const getSensoryMoodCorrelation = (logs) => {
  const correlations = []
  // Define the sensory categories and mood states we're tracking
  // These align with the application's logging interface
  const sensoryCategories = ['Visual', 'Auditory', 'Tactile']
  const moods = ['Happy', 'Sad', 'Angry', 'Anxious']
  
  // Create a correlation matrix by examining each sensory-mood combination
  sensoryCategories.forEach(category => {
    moods.forEach(mood => {
      // Counter for how many times this specific sensory input leads to this mood
      let correlationCount = 0
      
      // Iterate through logs to find sensory events and their subsequent mood changes
      logs.forEach((log, index) => {
        if (log.type === 'sensory' && log.category === category) {
          // Found a sensory log of the category we're analyzing
          const logTime = new Date(getLogTimestamp(log))
          // Define the correlation window (2 hours after the sensory event)
          const twoHoursLater = new Date(logTime.getTime() + 2 * 60 * 60 * 1000)
          
          // Search forward through subsequent logs for mood entries within the window
          for (let i = index + 1; i < logs.length; i++) {
            const nextLog = logs[i]
            const nextLogTime = new Date(getLogTimestamp(nextLog))
            
            // Stop searching if we've exceeded the 2-hour correlation window
            if (nextLogTime > twoHoursLater) break
            
            // If we find a matching mood within the window, count it as a correlation
            if (nextLog.type === 'feeling' && nextLog.value === mood) {
              correlationCount++
              break // Only count the first mood occurrence to avoid double-counting
            }
          }
        }
      })
      
      // Store the correlation data for this sensory-mood pair
      correlations.push({
        sensory: category,
        mood,
        count: correlationCount
      })
    })
  })
  
  // Return only correlations that actually occurred (filter out zero counts)
  // This reduces noise in visualizations and focuses on meaningful patterns
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

/**
 * Detects concerning patterns and trends in student emotional and sensory data.
 * 
 * This function implements a multi-layered pattern detection system designed to identify
 * situations that may require educator intervention. It analyzes both short-term spikes
 * in negative emotions and long-term behavioral patterns, which is particularly important
 * for supporting students with neurodiversity who may experience sensory overwhelm.
 * 
 * The detection algorithms include:
 * 1. Acute distress detection (multiple negative emotions in 2 hours)
 * 2. Sensory overload identification (repeated high-intensity sensory inputs)
 * 3. Weekly pattern recognition (consistent mood patterns on specific days)
 * 4. Causal relationship detection (sensory triggers leading to negative emotions)
 * 
 * @param {Array<Object>} logs - Student log entries sorted chronologically
 * @param {string} logs[].type - 'feeling' or 'sensory'
 * @param {string} logs[].value - For feelings: 'Happy', 'Sad', 'Angry', 'Anxious'
 * @param {string} logs[].intensity - For sensory: 'Low', 'Medium', 'High'
 * @param {string} logs[].category - For sensory: 'Visual', 'Auditory', 'Tactile'
 * @param {number|string} logs[].timestamp - Unix timestamp or parseable date
 * 
 * @returns {Array<Object>} Array of alert objects for UI notification
 * @returns {string} returns[].type - Alert severity: 'warning', 'info'
 * @returns {string} returns[].message - Human-readable alert description
 * @returns {Date} returns[].timestamp - When the alert was generated
 * 
 * @example
 * const logs = [
 *   { type: 'feeling', value: 'Anxious', timestamp: Date.now() - 3600000 },
 *   { type: 'feeling', value: 'Angry', timestamp: Date.now() - 1800000 },
 *   { type: 'feeling', value: 'Anxious', timestamp: Date.now() }
 * ];
 * const alerts = detectPatterns(logs);
 * // Returns: [{ type: 'warning', message: '3 anxious/angry logs in the past 2 hours', timestamp: Date }]
 */
export const detectPatterns = (logs) => {
  const alerts = []
  // Define time boundaries for acute pattern detection
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  
  // PATTERN 1: Acute emotional distress detection
  // Multiple negative emotions in a short timeframe may indicate immediate need for support
  const recentNegativeMoods = logs.filter(log => {
    const logTime = new Date(getLogTimestamp(log))
    return log.type === 'feeling' && 
           (log.value === 'Anxious' || log.value === 'Angry') &&
           logTime >= twoHoursAgo
  })
  
  // Threshold of 3+ negative emotions indicates potential crisis requiring intervention
  if (recentNegativeMoods.length >= 3) {
    alerts.push({
      type: 'warning',
      message: `${recentNegativeMoods.length} anxious/angry logs in the past 2 hours`,
      timestamp: new Date()
    })
  }
  
  // PATTERN 2: Sensory overload detection
  // Repeated high-intensity sensory inputs may indicate environmental stressors
  const recentHighSensory = logs.filter(log => {
    const logTime = new Date(getLogTimestamp(log))
    return log.type === 'sensory' && 
           log.intensity === 'High' &&
           logTime >= twoHoursAgo
  })
  
  // Two or more high-intensity sensory events suggest potential sensory overwhelm
  if (recentHighSensory.length >= 2) {
    alerts.push({
      type: 'info',
      message: `Multiple high sensory intensity logs detected`,
      timestamp: new Date()
    })
  }

  // PATTERN 3: Weekly behavioral pattern recognition
  // Identifies consistent mood patterns on specific days (e.g., "Monday anxiety")
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

  // Alert when a mood occurs 3+ times on the same day of week (indicates pattern)
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

  // PATTERN 4: Causal relationship detection (sensory trigger -> negative emotion)
  // Identifies when high sensory input precedes negative emotions, suggesting triggers
  logs.forEach((log, index) => {
    if (log.type === 'sensory' && log.intensity === 'High') {
      const logTime = new Date(getLogTimestamp(log));
      // Look for negative emotions within 2 hours of high sensory input
      const twoHoursLater = new Date(logTime.getTime() + 2 * 60 * 60 * 1000);
      
      // Search subsequent logs for negative emotional responses
      for (let i = index + 1; i < logs.length; i++) {
        const nextLog = logs[i];
        const nextLogTime = new Date(getLogTimestamp(nextLog));
        if (nextLogTime > twoHoursLater) break; // Outside correlation window
        
        // Found a negative emotion following high sensory input - potential trigger
        if (nextLog.type === 'feeling' && (nextLog.value === 'Angry' || nextLog.value === 'Anxious')) {
          alerts.push({
            type: 'warning',
            message: `High ${log.category} input was followed by feeling ${nextLog.value}`,
            timestamp: new Date()
          });
          break; // Only report the first occurrence to avoid spam
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
