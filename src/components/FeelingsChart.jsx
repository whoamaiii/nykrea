import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getMoodColor } from '../utils/analyticsHelpers'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-md border border-gray-700">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

function FeelingsChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 p-4">No feeling data to display.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getMoodColor(entry.name)} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default FeelingsChart
