/**
 * @fileoverview Reusable pie-chart component that visualises how often each mood has been logged.
 *               The component is UI-focused and delegates all heavy data aggregation to
 *               helper utilities so it can remain a simple, stateless view.
 */
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getMoodColor } from '../utils/analyticsHelpers'

/**
 * Custom tooltip renderer used by Recharts. We use a dedicated component instead of the default
 * string formatter so that we can style the tooltip with Tailwind utility classes and keep the
 * look consistent with the rest of the dark UI theme.
 *
 * @param {Object}   props
 * @param {boolean}  props.active   – Will be true while the tooltip is visible.
 * @param {Array}    props.payload  – Data array supplied by Recharts for the hovered slice.
 * @returns {React.ReactElement|null}
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-md border border-gray-700">
        {/* Display name and value of the hovered slice */}
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

/**
 * FeelingsChart
 * -------------
 * Presentational component that renders a *PieChart* with colour-coded slices for each mood.
 * The component is deliberately *stateless* – all heavy calculations (grouping & counting) are
 * performed in `chartHelpers.processFeelingsData`, keeping React renders lean.
 *
 * @param {Object} props
 * @param {Array<{ name: string, value: number }>} props.data – Pre-aggregated chart data. Each
 *        item’s `name` corresponds to a mood (e.g. "Happy") and `value` to its occurrence count.
 *
 * @returns {React.ReactElement}
 *
 * @example
 * const data = processFeelingsData(studentLogs);
 * <FeelingsChart data={data} />
 */
function FeelingsChart({ data }) {
  // Early exit: Nothing to show yet
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
