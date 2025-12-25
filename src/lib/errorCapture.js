// Error capture utility for dev mode debugging
// Captures JS errors and unhandled promise rejections

const MAX_ERRORS = 20;
let errorLog = [];
let listeners = [];

// Format error for display
function formatError(error, source = 'unknown') {
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    time: new Date().toLocaleTimeString(),
    message: error?.message || String(error),
    stack: error?.stack?.split('\n').slice(0, 3).join('\n') || null,
    source,
  };
}

// Add error to log and notify listeners
function logError(error, source) {
  const entry = formatError(error, source);
  errorLog = [entry, ...errorLog].slice(0, MAX_ERRORS);
  listeners.forEach(fn => fn(errorLog));
}

// Initialize error capture
export function initErrorCapture() {
  // Capture uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || { message }, 'window.onerror');
    return false; // Don't prevent default handling
  };

  // Capture unhandled promise rejections
  window.onunhandledrejection = (event) => {
    logError(event.reason, 'unhandledrejection');
  };

  // Capture console.error calls
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args.map(a =>
      typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
    ).join(' ');
    logError({ message }, 'console.error');
    originalConsoleError.apply(console, args);
  };
}

// Subscribe to error log updates
export function subscribeToErrors(callback) {
  listeners.push(callback);
  callback(errorLog); // Initial state
  return () => {
    listeners = listeners.filter(fn => fn !== callback);
  };
}

// Get current error log
export function getErrorLog() {
  return errorLog;
}

// Clear error log
export function clearErrorLog() {
  errorLog = [];
  listeners.forEach(fn => fn(errorLog));
}

// Manually log an error (for testing)
export function captureError(error, source = 'manual') {
  logError(error, source);
}
