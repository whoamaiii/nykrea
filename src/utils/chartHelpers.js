/**
 * Chart Helper Utilities
 * 
 * This module provides data processing functions for converting student emotional
 * and sensory logs into formats suitable for chart visualization using Recharts.
 * These functions are essential for the analytics dashboard that helps educators
 * understand patterns in student behavior and sensory processing.
 * 
 * The helpers focus on two main visualization types:
 * 1. Feelings breakdown - Distribution of emotional states
 * 2. Sensory analysis - Intensity patterns across sensory categories
 * 
 * @module chartHelpers
 */

/**
 * Processes student logs to generate data for the Feelings Breakdown chart.
 * 
 * This function analyzes emotional log entries to create a distribution showing
 * how frequently each emotion occurs. This helps educators identify predominant
 * emotional patterns and potential areas of concern or success.
 * 
 * The function filters for 'feeling' type logs, counts occurrences of each emotion,
 * and sorts by frequency (highest first) to highlight the most common feelings.
 * This ordering helps draw attention to the emotions that dominate a student's
 * experience.
 * 
 * @param {Array<Object>} logs - The student's complete log history
 * @param {string} logs[].type - Log entry type (must be 'feeling' for inclusion)
 * @param {string} logs[].value - Emotion name: 'Happy', 'Sad', 'Angry', or 'Anxious'
 * @param {number|string} logs[].timestamp - When the emotion was logged
 * @param {string} [logs[].description] - Optional context about the feeling
 * 
 * @returns {Array<Object>} Data formatted for Recharts pie/bar charts
 * @returns {string} returns[].name - Emotion name for chart labeling
 * @returns {number} returns[].value - Count of occurrences for chart sizing
 * 
 * @example
 * const logs = [
 *   { type: 'feeling', value: 'Happy', timestamp: 1640995200000 },
 *   { type: 'feeling', value: 'Happy', timestamp: 1640998800000 },
 *   { type: 'feeling', value: 'Anxious', timestamp: 1641002400000 },
 *   { type: 'sensory', category: 'Visual', timestamp: 1641006000000 } // Excluded
 * ];
 * 
 * const result = processFeelingsData(logs);
 * // Returns: [
 * //   { name: 'Happy', value: 2 },
 * //   { name: 'Anxious', value: 1 }
 * // ]
 */
export const processFeelingsData = (logs) => {
  // Count occurrences of each feeling type
  // Use reduce to build a frequency map for efficient counting
  const feelingsCount = logs
    .filter(log => log.type === 'feeling') // Only include emotional logs
    .reduce((acc, log) => {
      acc[log.value] = (acc[log.value] || 0) + 1
      return acc
    }, {})

  // Convert the frequency map to chart-ready format and sort by frequency
  // Sorting descending helps users quickly identify dominant emotions
  return Object.entries(feelingsCount).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value) // Sort by frequency (highest first)
}

/**
 * Processes student logs to generate data for the Sensory Input Analysis chart.
 * 
 * This function creates a comprehensive breakdown of sensory experiences across
 * different categories and intensity levels. It's particularly valuable for
 * understanding sensory processing patterns in neurodiverse students who may
 * have heightened sensitivities or specific sensory needs.
 * 
 * The function handles legacy log format compatibility by parsing the 'sensory'
 * field which combines category and intensity (e.g., "Visual - High"). It builds
 * a matrix showing how often each sensory category occurs at each intensity level.
 * 
 * Only categories with recorded data are returned to keep visualizations focused
 * on relevant sensory experiences rather than showing empty categories.
 * 
 * @param {Array<Object>} logs - The student's complete log history
 * @param {string} logs[].type - Log entry type (must be 'sensory' for inclusion)
 * @param {string} logs[].sensory - Combined category and intensity string (e.g., "Auditory - Medium")
 * @param {number|string} logs[].timestamp - When the sensory input was logged
 * @param {string} [logs[].description] - Optional context about the sensory experience
 * 
 * @returns {Array<Object>} Data formatted for Recharts stacked bar charts
 * @returns {string} returns[].name - Sensory category name for x-axis labeling
 * @returns {number} returns[].Low - Count of low-intensity experiences
 * @returns {number} returns[].Medium - Count of medium-intensity experiences  
 * @returns {number} returns[].High - Count of high-intensity experiences
 * 
 * @throws {Error} May throw if log.sensory format is invalid (missing ' - ' separator)
 * 
 * @example
 * const logs = [
 *   { type: 'sensory', sensory: 'Visual - Low', timestamp: 1640995200000 },
 *   { type: 'sensory', sensory: 'Visual - High', timestamp: 1640998800000 },
 *   { type: 'sensory', sensory: 'Auditory - Medium', timestamp: 1641002400000 },
 *   { type: 'feeling', value: 'Happy', timestamp: 1641006000000 } // Excluded
 * ];
 * 
 * const result = processSensoryData(logs);
 * // Returns: [
 * //   { name: 'Visual', Low: 1, Medium: 0, High: 1 },
 * //   { name: 'Auditory', Low: 0, Medium: 1, High: 0 }
 * // ]
 */
export const processSensoryData = (logs) => {
  // Initialize all possible sensory categories with zero counts
  // This comprehensive list covers the full range of sensory processing areas
  // that may be relevant for neurodiverse students
  const sensoryLevels = {
    'Visual': { Low: 0, Medium: 0, High: 0 },           // Light, color, visual stimuli
    'Auditory': { Low: 0, Medium: 0, High: 0 },         // Sound, noise, auditory input
    'Tactile': { Low: 0, Medium: 0, High: 0 },          // Touch, texture, physical contact
    'Olfactory': { Low: 0, Medium: 0, High: 0 },        // Smell, scents, chemical detection
    'Gustatory': { Low: 0, Medium: 0, High: 0 },        // Taste, flavor, oral input
    'Vestibular': { Low: 0, Medium: 0, High: 0 },       // Balance, spatial orientation
    'Proprioception': { Low: 0, Medium: 0, High: 0 },   // Body position, muscle feedback
  }

  // Process each sensory log to extract category and intensity information
  logs
    .filter(log => log.type === 'sensory' && log.sensory) // Only process valid sensory logs
    .forEach(log => {
      // Parse the legacy format "Category - Intensity" 
      // This maintains compatibility with existing data while extracting structured info
      const [type, level] = log.sensory.split(' - ')
      
      // Validate that both category and intensity were successfully extracted
      // Only count entries with complete, valid data to maintain chart accuracy
      if (sensoryLevels[type] && level) {
        sensoryLevels[type][level] = (sensoryLevels[type][level] || 0) + 1
      }
    })

  // Convert to chart format and filter out empty categories
  // This reduces visual clutter by showing only categories with recorded data
  return Object.entries(sensoryLevels)
    .map(([name, levels]) => ({ name, ...levels }))
    .filter(d => d.Low > 0 || d.Medium > 0 || d.High > 0) // Only include categories with data
}
