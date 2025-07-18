import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Custom tooltip component for displaying detailed sensory data on chart hover.
 * 
 * This enhanced tooltip provides clear, accessible information about sensory
 * intensity levels when users interact with the chart. The dark theme and
 * color-coded display helps users quickly understand the data while maintaining
 * visual consistency with the overall application design.
 * 
 * @param {Object} props - Recharts tooltip props
 * @param {boolean} props.active - Whether the tooltip is currently active/visible
 * @param {Array} props.payload - Data for the currently hovered chart element
 * @param {string} props.label - The category name for the hovered bar group
 * 
 * @returns {JSX.Element|null} Formatted tooltip component or null if inactive
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-md border border-gray-700 shadow-lg">
        <p className="font-bold text-base mb-2">{label}</p>
        {/* Display each intensity level with its corresponding color */}
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.fill }}>{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * SensoryChart - Visualizes sensory input intensity patterns across different categories.
 * 
 * This component renders a stacked bar chart that helps educators understand how
 * students experience different types of sensory input (Visual, Auditory, Tactile, etc.)
 * and at what intensity levels. This visualization is particularly valuable for:
 * 
 * - Identifying sensory categories that frequently cause overwhelm (high intensity)
 * - Understanding which sensory systems are most/least active for a student
 * - Planning environmental accommodations based on sensory processing patterns
 * - Tracking changes in sensory sensitivity over time
 * 
 * The stacked bar format allows simultaneous comparison of:
 * 1. Total sensory activity per category (bar height)
 * 2. Distribution of intensity levels within each category (stack proportions)
 * 3. Relative differences between sensory categories (bar-to-bar comparison)
 * 
 * Color coding follows accessibility standards:
 * - Blue (Low): Calm, manageable sensory input
 * - Yellow (Medium): Moderate sensory input requiring attention
 * - Red (High): Intense sensory input that may cause overwhelm
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Processed sensory data from chartHelpers.processSensoryData()
 * @param {string} props.data[].name - Sensory category name (Visual, Auditory, etc.)
 * @param {number} props.data[].Low - Count of low-intensity experiences
 * @param {number} props.data[].Medium - Count of medium-intensity experiences
 * @param {number} props.data[].High - Count of high-intensity experiences
 * 
 * @returns {JSX.Element} Responsive stacked bar chart or empty state message
 * 
 * @example
 * // Display sensory analysis for a student
 * const sensoryData = [
 *   { name: 'Visual', Low: 3, Medium: 2, High: 1 },
 *   { name: 'Auditory', Low: 1, Medium: 4, High: 3 }
 * ];
 * 
 * return <SensoryChart data={sensoryData} />;
 */
function SensoryChart({ data }) {
  // Handle empty state gracefully to maintain good user experience
  // This prevents chart rendering errors and provides helpful feedback
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 p-4">No sensory data to display.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* Subtle grid lines improve data readability without visual clutter */}
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        
        {/* X-axis shows sensory category names (Visual, Auditory, etc.) */}
        <XAxis dataKey="name" stroke="#9CA3AF" />
        
        {/* Y-axis shows count values for intensity levels */}
        <YAxis stroke="#9CA3AF" />
        
        {/* Enhanced tooltip with custom styling and detailed information */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(75, 85, 99, 0.3)' }}/>
        
        {/* Legend helps users understand the color coding for intensity levels */}
        <Legend />
        
        {/* Stacked bars for each intensity level with intuitive color progression */}
        {/* Blue for low intensity - represents calm, manageable sensory input */}
        <Bar dataKey="Low" stackId="a" fill="#3B82F6" />
        
        {/* Yellow for medium intensity - represents moderate sensory input */}
        <Bar dataKey="Medium" stackId="a" fill="#FBBF24" />
        
        {/* Red for high intensity - represents intense sensory input that may overwhelm */}
        <Bar dataKey="High" stackId="a" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SensoryChart
