import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-md border border-gray-700 shadow-lg">
        <p className="font-bold text-base mb-2">{label}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.fill }}>{`${pld.name}: ${pld.value}`}</p>
        ))}
      </div>
    )
  }
  return null
}

function SensoryChart({ data }) {
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
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(75, 85, 99, 0.3)' }}/>
        <Legend />
        <Bar dataKey="Low" stackId="a" fill="#3B82F6" />
        <Bar dataKey="Medium" stackId="a" fill="#FBBF24" />
        <Bar dataK ey="High" stackId="a" fill="#EF4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SensoryChart
