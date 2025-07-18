import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMoodColor, getSensoryColor } from '../utils/analyticsHelpers';
import { format } from 'date-fns';

const TimeStateCorrelation = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-[var(--text-secondary)]">No data for correlation analysis.</p>;
  }

  const chartData = data.map(log => {
    const logDate = new Date(log.timestamp);
    const time = logDate.getHours() + logDate.getMinutes() / 60;
    let name, color;

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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis 
          dataKey="time" 
          type="number" 
          domain={[0, 24]} 
          tickFormatter={(time) => `${Math.floor(time)}:00`}
          stroke="var(--text-secondary)"
          label={{ value: 'Time of Day', position: 'insideBottom', offset: -5, fill: 'var(--text-secondary)' }}
        />
        <YAxis 
          dataKey="value" 
          type="number" 
          domain={[0, 3]} 
          ticks={[1, 2]} 
          tickFormatter={(value) => value === 1 ? 'Feeling' : 'Sensory'}
          stroke="var(--text-secondary)"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Scatter name="Feelings" data={chartData.filter(d => d.type === 'feeling')} fill={getMoodColor('Happy')} />
        <Scatter name="Sensory" data={chartData.filter(d => d.type === 'sensory')} fill={getSensoryColor('Visual')} />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default TimeStateCorrelation;
