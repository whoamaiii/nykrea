import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMoodColor, getSensoryColor } from '../utils/analyticsHelpers';
import { format } from 'date-fns';

/**
 * TimeStateCorrelation - Visualizes temporal patterns between student emotional states and sensory inputs.
 * 
 * This component creates a scatter plot that reveals time-based patterns in student behavior,
 * which is particularly valuable for educators working with neurodiverse students who may
 * have predictable sensory sensitivities or emotional patterns throughout the day.
 * 
 * The visualization maps time of day (x-axis) against event type (y-axis), with separate
 * tracks for emotional feelings and sensory inputs. This dual-track approach allows
 * educators to identify:
 * - Times when students typically experience certain emotions
 * - Periods of high sensory input that might correlate with mood changes
 * - Daily rhythm patterns that could inform scheduling decisions
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of student log entries for visualization
 * @param {string} props.data[].type - Entry type: 'feeling' or 'sensory'
 * @param {string} props.data[].value - For feelings: emotion name (Happy, Sad, etc.)
 * @param {string} props.data[].category - For sensory: category (Visual, Auditory, Tactile)
 * @param {number|string} props.data[].timestamp - When the log was recorded
 * 
 * @returns {JSX.Element} Scatter chart visualization or empty state message
 * 
 * @example
 * const studentLogs = [
 *   { type: 'feeling', value: 'Happy', timestamp: new Date('2024-01-15T09:30:00').getTime() },
 *   { type: 'sensory', category: 'Auditory', timestamp: new Date('2024-01-15T14:15:00').getTime() }
 * ];
 * return <TimeStateCorrelation data={studentLogs} />;
 */
const TimeStateCorrelation = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-[var(--text-secondary)]">No data for correlation analysis.</p>;
  }

  // Transform log data into scatter plot format
  // Convert timestamps to decimal hours (e.g., 2:30 PM = 14.5)
  const chartData = data.map(log => {
    const logDate = new Date(log.timestamp);
    const time = logDate.getHours() + logDate.getMinutes() / 60;
    let name, color;

    // Determine display properties based on log type
    if (log.type === 'feeling') {
      name = log.value;
      color = getMoodColor(log.value);
    } else {
      name = log.category;
      color = getSensoryColor(log.category);
    }

    return {
      time,
      name,
      type: log.type,
      value: log.type === 'feeling' ? 1 : 2, // Separate feelings and sensory on y-axis
      color: color,
      timestamp: log.timestamp,
    };
  });

  /**
   * Custom tooltip component for displaying detailed log information on hover.
   * Shows the specific emotion/sensory category and exact timestamp.
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--card-background)] p-2 border border-gray-700/50 rounded-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            {format(new Date(data.timestamp), 'MMM d, yyyy, h:mm a')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        {/* Grid lines for easier reading of time correlations */}
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        
        {/* X-axis: Time of day from 0-24 hours */}
        <XAxis 
          dataKey="time" 
          type="number" 
          domain={[0, 24]} 
          tickFormatter={(time) => `${Math.floor(time)}:00`} // Format as HH:00
          stroke="var(--text-secondary)"
          label={{ value: 'Time of Day', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }}
        />
        
        {/* Y-axis: Separate tracks for feelings (1) and sensory inputs (2) */}
        <YAxis 
          dataKey="value" 
          type="number" 
          domain={[0, 3]} 
          ticks={[1, 2]} 
          tickFormatter={(value) => value === 1 ? 'Feeling' : 'Sensory'}
          stroke="var(--text-secondary)"
        />
        
        {/* Interactive tooltip showing detailed log information */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {/* Separate scatter series for feelings and sensory data for better visual distinction */}
        <Scatter name="Feelings" data={chartData.filter(d => d.type === 'feeling')} fill={getMoodColor('Happy')} />
        <Scatter name="Sensory" data={chartData.filter(d => d.type === 'sensory')} fill={getSensoryColor('Visual')} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default TimeStateCorrelation;
