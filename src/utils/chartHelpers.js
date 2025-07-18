/**
 * Processes student logs to generate data for the Feelings Breakdown chart.
 * @param {Array} logs - The student's logs.
 * @returns {Array} Data formatted for Recharts (e.g., [{ name: 'Happy', value: 5 }]).
 */
export const processFeelingsData = (logs) => {
  const feelingsCount = logs
    .filter(log => log.type === 'feeling')
    .reduce((acc, log) => {
      acc[log.value] = (acc[log.value] || 0) + 1
      return acc
    }, {})

  return Object.entries(feelingsCount).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value)
}

/**
 * Processes student logs to generate data for the Sensory Input Analysis chart.
 * @param {Array} logs - The student's logs.
 * @returns {Array} Data formatted for Recharts.
 */
export const processSensoryData = (logs) => {
  const sensoryLevels = {
    'Visual': { Low: 0, Medium: 0, High: 0 },
    'Auditory': { Low: 0, Medium: 0, High: 0 },
    'Tactile': { Low: 0, Medium: 0, High: 0 },
    'Olfactory': { Low: 0, Medium: 0, High: 0 },
    'Gustatory': { Low: 0, Medium: 0, High: 0 },
    'Vestibular': { Low: 0, Medium: 0, High: 0 },
    'Proprioception': { Low: 0, Medium: 0, High: 0 },
  }

  logs
    .filter(log => log.type === 'sensory' && log.sensory)
    .forEach(log => {
      const [type, level] = log.sensory.split(' - ')
      if (sensoryLevels[type] && level) {
        sensoryLevels[type][level] = (sensoryLevels[type][level] || 0) + 1
      }
    })

  return Object.entries(sensoryLevels)
    .map(([name, levels]) => ({ name, ...levels }))
    .filter(d => d.Low > 0 || d.Medium > 0 || d.High > 0)
}
