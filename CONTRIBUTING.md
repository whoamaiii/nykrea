# Contributing Guide

Thank you for considering contributing to the Student Logging Application! This guide will help you get started with development and ensure your contributions align with the project standards.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-logging-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open http://localhost:5173
   - Create a test log entry
   - Check that data persists on page reload

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
```

### 2. Make Your Changes
- Follow the [coding standards](#coding-standards) below
- Write clear, descriptive commit messages
- Test your changes thoroughly

### 3. Test Your Changes
```bash
# Run build test
npm run build

# Check for linting issues (if configured)
npm run lint

# Manual testing checklist:
# - Student creation/deletion
# - Log creation and editing  
# - Timeline display
# - Analytics charts
# - Local storage persistence
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new analytics chart for mood trends"
# or
git commit -m "fix: resolve timestamp parsing issue in LogTimeline"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Create a pull request with:
- Clear title and description
- Screenshots for UI changes
- Test steps for reviewers
- Reference to any related issues

## Coding Standards

### React Component Structure

```javascript
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types' // If using PropTypes

/**
 * Brief component description
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 * @param {Function} props.onAction - Callback description
 */
function ComponentName({ title, onAction }) {
  // State declarations
  const [localState, setLocalState] = useState(initialValue)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  // Event handlers
  const handleAction = (data) => {
    // Handler logic
    onAction(data)
  }
  
  // Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  )
}

export default ComponentName
```

### Timestamp Handling
**ALWAYS** use the `getLogTimestamp()` helper when processing log dates:

```javascript
// ✅ Correct
const getLogTimestamp = (log) => {
  if (typeof log.timestamp === 'number') return log.timestamp;
  if (typeof log.timestamp === 'string') return new Date(log.timestamp).getTime();
  return typeof log.id === 'number' ? log.id : new Date(log.id).getTime();
}

const logDate = new Date(getLogTimestamp(log));

// ❌ Incorrect
const logDate = new Date(log.timestamp); // May fail on legacy data
```

### State Management Patterns

```javascript
// ✅ Handle dependent state updates in same function
const handleDeleteStudent = (studentId) => {
  setStudents(prevStudents => {
    const updated = prevStudents.filter(s => s.id !== studentId);
    if (selectedStudentId === studentId) {
      setSelectedStudentId(updated[0]?.id || null);
    }
    return updated;
  });
}

// ❌ Separate updates can cause race conditions
const handleDeleteStudent = (studentId) => {
  setStudents(prev => prev.filter(s => s.id !== studentId));
  if (selectedStudentId === studentId) {
    setSelectedStudentId(students[0]?.id); // Uses stale state
  }
}
```

### Error Handling

```javascript
// ✅ Proper error handling
try {
  const result = await apiCall();
  setData(result);
} catch (error) {
  console.error('Operation failed:', error);
  setError(error.message);
}

// ❌ Missing error handling
const result = await apiCall();
setData(result);
```

### Styling Guidelines

1. **Use CSS custom properties for theme colors**:
   ```javascript
   className="bg-[var(--card-background)] text-[var(--text-primary)]"
   ```

2. **Consistent spacing and sizing**:
   ```javascript
   className="p-6 mb-4 rounded-2xl" // Use consistent spacing
   ```

3. **Responsive design considerations**:
   ```javascript
   className="grid grid-cols-1 lg:grid-cols-3 gap-4"
   ```

## Project-Specific Guidelines

### Adding New Analytics

1. **Create data processing function** in `utils/analyticsHelpers.js`:
   ```javascript
   export const getNewAnalytic = (logs) => {
     // Use getLogTimestamp() for date operations
     return logs.filter(log => /* conditions */)
       .map(log => ({
         // Return chart-ready data
       }));
   }
   ```

2. **Create chart component** in `components/`:
   ```javascript
   import { ResponsiveContainer, LineChart } from 'recharts';
   
   function NewChart({ data }) {
     return (
       <ResponsiveContainer width="100%" height={300}>
         {/* Chart implementation */}
       </ResponsiveContainer>
     );
   }
   ```

3. **Add to Analytics component**:
   ```javascript
   const newData = getNewAnalytic(filteredLogs);
   ```

### Adding New Log Types

1. **Update data model** (document in DEVELOPMENT.md):
   ```javascript
   {
     type: 'new-type',
     // ... other properties
   }
   ```

2. **Update StudentLoggingView** for UI:
   ```javascript
   const handleNewTypeLog = (data) => {
     const timestamp = Date.now() + Math.floor(Math.random() * 100);
     const newLog = {
       id: timestamp,
       timestamp: timestamp,
       type: 'new-type',
       // ... other properties
     };
     onAddLog(newLog);
   }
   ```

3. **Update analytics helpers** to handle new type:
   ```javascript
   if (log.type === 'new-type') {
     // Handle new type
   }
   ```

## Common Issues

### Timestamp-Related Bugs
- **Always use `getLogTimestamp()`** when processing log dates
- Test with both old demo data and new logs
- Verify date-fns functions receive proper Date objects

### State Management Issues
- Handle dependent state in the same update function
- Use functional updates when depending on previous state
- Avoid accessing state immediately after setState

### Chart Rendering Problems
- Ensure data arrays are properly formatted
- Verify dataKey matches object properties
- Check ResponsiveContainer dimensions

## Documentation Requirements

When making changes, update relevant documentation:

1. **Code comments** for complex logic
2. **Component JSDoc** for new components
3. **DEVELOPMENT.md** for new patterns or APIs
4. **README.md** for setup or usage changes

## Review Process

### Before Submitting
- [ ] Code follows project standards
- [ ] Manual testing completed
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in development
- [ ] Documentation updated if needed

### Pull Request Review
- Code review by maintainer
- Testing of new functionality
- Documentation review
- Final approval and merge

## Getting Help

- **Check existing documentation**: README.md, DEVELOPMENT.md, BUGFIXES.md
- **Search existing issues** for similar problems
- **Create new issue** with detailed description and steps to reproduce
- **Ask questions** in pull request discussions

## Code of Conduct

- Be respectful and constructive in all interactions
- Focus on the code and technical aspects
- Help others learn and grow
- Collaborate openly and transparently

---

Thank you for contributing to the Student Logging Application! Your help makes this tool better for teachers and students everywhere.

*Last Updated: January 2025*