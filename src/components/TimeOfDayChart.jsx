import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMoodColor } from '../utils/analyticsHelpers';

const TimeOfDayChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-[var(--text-secondary)]">No data available for time of day analysis.</p>;
  }

  const timeSegments = {
    Morning: { start: 6, end: 12, moods: {} },
    Afternoon: { start: 12, end: 18, moods: {} },
    Evening: { start: 18, end: 24, moods: {} },
    Night: { start: 0, end: 6, moods: {} },
  };

  data.forEach(log => {
    // Helper function to get timestamp from log (handles both old and new formats)
    const getLogTimestamp = (log) => {
      if (typeof log.timestamp === 'number') return log.timestamp;
      if (typeof log.timestamp === 'string') return new Date(log.timestamp).getTime();
      return typeof log.id === 'number' ? log.id : new Date(log.id).getTime();
    }
    
    const logDate = new Date(getLogTimestamp(log));
    const hour = logDate.getHours();
    for (const segment in timeSegments) {
      if (hour >= timeSegments[segment].start && hour < timeSegments[segment].end) {
        if (!timeSegments[segment].moods[log.value]) {
          timeSegments[segment].moods[log.value] = 0;
        }
        timeSegments[segment].moods[log.value]++;
      }
    }
  });

  const chartData = Object.keys(timeSegments).map(segment => ({
    name: segment,
    ...timeSegments[segment].moods
  }));

  const moods = [...new Set(data.map(log => log.value))];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
        <XAxis dataKey="name" stroke="var(--text-secondary)" />
        <YAxis stroke="var(--text-secondary)" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card-background)',
            borderColor: 'var(--border-color)',
          }}
        />
        <Legend />
        {moods.map(mood => (
          <Bar key={mood} dataKey={mood} stackId="a" fill={getMoodColor(mood)} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeOfDayChart;
