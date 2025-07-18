import React, { useState, useMemo } from 'react'
import { processFeelingsData, processSensoryData } from '../utils/chartHelpers'
import { subDays, startOfDay } from 'date-fns';
import FeelingsChart from './FeelingsChart'
import SensoryChart from './SensoryChart'
import TimeOfDayChart from './TimeOfDayChart'
import TimeStateCorrelation from './TimeStateCorrelation'
import ScheduleAnalytics from './ScheduleAnalytics'
import Alerts from './Alerts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

function Analytics({ logs, studentName, schedule }) {
  const [timeRange, setTimeRange] = useState(7);

  const filteredLogs = useMemo(() => {
    if (timeRange === 'all') return logs;
    const startDate = startOfDay(subDays(new Date(), timeRange - 1));
    return logs.filter(log => new Date(log.timestamp) >= startDate);
  }, [logs, timeRange]);

  const feelingsData = processFeelingsData(filteredLogs)
  const sensoryData = processSensoryData(filteredLogs)

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CardContent className="pt-6">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Start logging student activities to see analytics.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Analytics for {studentName}</h3>
          <p className="text-muted-foreground">A summary of logged feelings and sensory inputs.</p>
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="timeRange" className="text-sm font-medium text-muted-foreground">
              Time Range:
            </label>
            <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(value === 'all' ? 'all' : Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feelings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <FeelingsChart data={feelingsData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sensory Input Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SensoryChart data={sensoryData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Moods by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeOfDayChart data={filteredLogs.filter(log => log.type === 'feeling')} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Time & State Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeStateCorrelation data={filteredLogs} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Moods by School Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleAnalytics logs={filteredLogs} schedule={schedule} />
          </CardContent>
        </Card>
      </div>
      <Alerts logs={logs} />
    </div>
  )
}

export default Analytics
