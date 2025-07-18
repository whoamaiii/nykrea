import React, { useState } from 'react';

const ScheduleSettings = ({ schedule, onSave }) => {
  const [localSchedule, setLocalSchedule] = useState(schedule || []);

  const handleAddPeriod = () => {
    setLocalSchedule([...localSchedule, { start: '09:00', end: '10:00', subject: '' }]);
  };

  const handleRemovePeriod = (index) => {
    const newSchedule = [...localSchedule];
    newSchedule.splice(index, 1);
    setLocalSchedule(newSchedule);
  };

  const handleChange = (index, field, value) => {
    const newSchedule = [...localSchedule];
    newSchedule[index][field] = value;
    setLocalSchedule(newSchedule);
  };

  return (
    <div className="bg-[var(--card-background)] rounded-2xl p-6 shadow-2xl border border-gray-700/50">
      <h3 className="text-xl font-semibold mb-4 text-white">School Schedule</h3>
      <div className="space-y-4">
        {localSchedule.map((period, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/70 rounded-lg">
            <input
              type="time"
              value={period.start}
              onChange={(e) => handleChange(index, 'start', e.target.value)}
              className="bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white"
            />
            <span className="text-white">to</span>
            <input
              type="time"
              value={period.end}
              onChange={(e) => handleChange(index, 'end', e.target.value)}
              className="bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Subject"
              value={period.subject}
              onChange={(e) => handleChange(index, 'subject', e.target.value)}
              className="flex-1 bg-[var(--input-background)] border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400"
            />
            <button onClick={() => handleRemovePeriod(index)} className="text-red-500 hover:text-red-400">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleAddPeriod}
          className="px-4 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-600"
        >
          Add Period
        </button>
        <button
          onClick={() => onSave(localSchedule)}
          className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white hover:opacity-90"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleSettings;
