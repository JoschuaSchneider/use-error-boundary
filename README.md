# React useErrorBoundary() hook

This react hook provides a ErrorBoundary class and the error state of the error boundary.

The ErrorBoundary is implemented using classes (as there is no hook-based componentDidCatch implementation yet).

### Installation

```bash
npm install --save use-error-boundary
```

### Usage

```javascript
import React from "react"
import { useErrorBoundary } from "use-error-boundary"

const myComponent = () => {
  const { ErrorBoundary, didCatch, error, errorInfo } = useErrorBoundary()

  if (didCatch) return <h1>Something went wrong</h1>

  return (
    <ErrorBoundary>
      <SomeChildren />
    </ErrorBoundary>
  )
}
```
