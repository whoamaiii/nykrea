# Development Documentation

This document provides guidance for developers working on the Student Logging Application.

## Project Overview

A React-based application for tracking student emotional states and sensory inputs, designed for teachers working with neurodiverse students. The app provides real-time logging, analytics, and AI-powered insights.

## Architecture

### Tech Stack
- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Handling**: date-fns
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite
- **Package Manager**: npm

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Analytics.jsx   # Analytics dashboard
│   ├── LogTimeline.jsx # Log display and editing
│   ├── Sidebar.jsx     # Student selection
│   └── ...
├── utils/              # Utility functions
│   ├── analyticsHelpers.js  # Data processing
│   └── chartHelpers.js      # Chart data preparation
├── lib/                # Library configurations
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── globals.css        # Global styles
```

## Core Concepts

### Data Models

#### Student Object
```javascript
{
  id: number,           // Unique identifier (Unix timestamp)
  name: string,         // Student name
  logs: LogEntry[],     // Array of log entries
  schedule?: Schedule   // Optional schedule data
}
```

#### Log Entry Object
```javascript
{
  id: number,                    // Unique identifier (Unix timestamp + random)
  type: 'feeling' | 'sensory',  // Log type
  timestamp: number,             // Unix timestamp
  value: string,                 // Feeling type or sensory category
  intensity?: string,            // For sensory logs: 'Low', 'Medium', 'High'
  category?: string,             // For sensory logs: 'Visual', 'Auditory', 'Tactile'
  notes?: string,                // Optional description
  environmentalFactors?: string  // Environmental context
}
```

### State Management

The application uses React's built-in state management with `useState` and `useEffect`. The main state is managed in `App.jsx`:

```javascript
const [students, setStudents] = useState([]);
const [selectedStudentId, setSelectedStudentId] = useState(null);
```

#### Local Storage Persistence
Student data is automatically saved to `localStorage` and restored on app load:

```javascript
// Save on state change
useEffect(() => {
  localStorage.setItem('kre-students', JSON.stringify(students));
}, [students]);

// Load on mount
const [students, setStudents] = useState(() => {
  const saved = localStorage.getItem('kre-students');
  return saved ? JSON.parse(saved) : initialStudents;
});
```

## Development Patterns

### Timestamp Handling

**Always use the `getLogTimestamp()` helper function** when processing log dates:

```javascript
const getLogTimestamp = (log) => {
  if (typeof log.timestamp === 'number') return log.timestamp;
  if (typeof log.timestamp === 'string') return new Date(log.timestamp).getTime();
  return typeof log.id === 'number' ? log.id : new Date(log.id).getTime();
}

// Usage
const logDate = new Date(getLogTimestamp(log));
```

### ID Generation

Use collision-resistant ID generation for new logs:

```javascript
const timestamp = Date.now() + Math.floor(Math.random() * 100);
const newLog = {
  id: timestamp,
  timestamp: timestamp,
  // ... other properties
};
```

### State Updates with Dependencies

When updating state that affects other state, handle dependencies in the same update:

```javascript
// ✅ Correct
setStudents(prevStudents => {
  const updated = prevStudents.filter(s => s.id !== studentId);
  if (selectedStudentId === studentId) {
    setSelectedStudentId(updated[0]?.id || null);
  }
  return updated;
});

// ❌ Avoid - race condition
setStudents(prev => prev.filter(s => s.id !== studentId));
if (selectedStudentId === studentId) {
  setSelectedStudentId(students[0]?.id); // Uses stale state
}
```

## Component Guidelines

### Props Interface

Define clear prop interfaces for components:

```javascript
/**
 * Component for displaying student logs timeline
 * @param {Object} props
 * @param {LogEntry[]} props.logs - Array of log entries
 * @param {Function} props.onDeleteLog - Callback to delete a log
 * @param {Function} props.onEditLog - Callback to edit a log
 */
function LogTimeline({ logs, onDeleteLog, onEditLog }) {
  // Component implementation
}
```

### Event Handlers

Use descriptive names for event handlers and pass minimal data:

```javascript
// ✅ Good
const handleStudentSelect = (studentId) => onSelectStudent(studentId);
const handleLogDelete = (logId) => onDeleteLog(logId);

// ❌ Avoid
const handleClick = (e) => onClick(e.target.dataset.id);
```

### Error Handling

Implement proper error handling, especially for:
- API calls (Gemini AI)
- Local storage operations
- Data parsing

```javascript
try {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  setError(error.message);
}
```

## Analytics & Data Processing

### Helper Functions

Use functions from `analyticsHelpers.js` for data processing:

```javascript
import { 
  getMoodDistribution,
  getMoodTrends,
  getTimeOfDayAnalysis,
  getSensoryIntensityData,
  detectPatterns
} from '../utils/analyticsHelpers';

// Process data for charts
const moodData = getMoodDistribution(logs);
const trends = getMoodTrends(logs, 7); // Last 7 days
```

### Chart Configuration

Charts use Recharts with consistent styling:

```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
    <XAxis dataKey="date" stroke="#9CA3AF" />
    <YAxis stroke="#9CA3AF" />
    <Tooltip contentStyle={{ 
      backgroundColor: 'var(--card-background)', 
      border: '1px solid #374151' 
    }} />
    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>
```

## Styling

### CSS Variables

The app uses CSS custom properties for theming:

```css
:root {
  --card-background: #1f2937;
  --sidebar-background: #111827;
  --input-background: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --accent-gradient-start: #3b82f6;
  --accent-gradient-end: #1d4ed8;
}
```

### Tailwind Classes

Use semantic Tailwind classes and maintain consistency:

```javascript
// ✅ Consistent button styling
className="px-4 py-2 bg-gradient-to-r from-[var(--accent-gradient-start)] to-[var(--accent-gradient-end)] text-white rounded-md hover:opacity-90 transition-opacity"

// ✅ Card styling
className="bg-[var(--card-background)] rounded-2xl p-6 shadow-2xl border border-gray-700/50"
```

## Testing

### Build Testing
```bash
npm run build
```

### Development Server
```bash
npm run dev
```

### Manual Testing Checklist
- [ ] Student creation and deletion
- [ ] Log creation (feelings and sensory)
- [ ] Timeline display and editing
- [ ] Analytics charts rendering
- [ ] Local storage persistence
- [ ] AI insights functionality

## Environment Setup

### Required Environment Variables
Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Common Issues & Solutions

### 1. Chart Not Rendering
- Check if data array is properly formatted
- Verify dataKey matches object properties
- Ensure ResponsiveContainer has proper dimensions

### 2. Local Storage Issues
- Check for JSON parsing errors
- Implement fallback to demo data
- Handle storage quota exceeded

### 3. Timestamp Parsing Errors
- Always use `getLogTimestamp()` helper
- Test with both old and new data formats
- Verify date-fns functions receive proper Date objects

## Performance Considerations

### Optimization Strategies
1. **Use `useMemo` for expensive calculations**:
   ```javascript
   const chartData = useMemo(() => 
     processChartData(logs), [logs]
   );
   ```

2. **Implement proper key props for lists**:
   ```javascript
   {logs.map(log => (
     <LogItem key={log.id} log={log} />
   ))}
   ```

3. **Debounce user inputs**:
   ```javascript
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     []
   );
   ```

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

---

*For bug fixes and recent changes, see [BUGFIXES.md](./BUGFIXES.md)*

*Last Updated: January 2025*