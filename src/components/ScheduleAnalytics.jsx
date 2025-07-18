import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMoodColor } from '../utils/analyticsHelpers';

const ScheduleAnalytics = ({ logs, schedule }) => {
  if (!schedule || schedule.length === 0) {
    return <p className="text-center text-[var(--text-secondary)]">No schedule set. Please add a schedule in the settings.</p>;
  }

  const moodsBySubject = {};

  logs.forEach(log => {
    const logTime = new Date(log.timestamp);
    const logHour = logTime.getHours();
    const logMinute = logTime.getMinutes();
    const logTotalMinutes = logHour * 60 + logMinute;

    schedule.forEach(period => {
      const [startHour, startMinute] = period.start.split(':').map(Number);
      const [endHour, endMinute] = period.end.split(':').map(Number);
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      if (logTotalMinutes >= startTotalMinutes && logTotalMinutes < endTotalMinutes) {
        if (!moodsBySubject[period.subject]) {
          moodsBySubject[period.subject] = {};
        }
        if (log.type === 'feeling') {
          if (!moodsBySubject[period.subject][log.value]) {
            moodsBySubject[period.subject][log.value] = 0;
          }
          moodsBySubject[period.subject][log.value]++;
        }
      }
    });
  });

  const chartData = Object.keys(moodsBySubject).map(subject => ({
    name: subject,
    ...moodsBySubject[subject]
  }));

  const moods = [...new Set(logs.filter(log => log.type === 'feeling').map(log => log.value))];

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

export default ScheduleAnalytics;
