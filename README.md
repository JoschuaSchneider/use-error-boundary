# use-error-boundary
![npm version](https://img.shields.io/npm/v/use-error-boundary.svg)
![build status](https://travis-ci.org/JoschuaSchneider/use-error-boundary.svg?branch=master)
![license](https://img.shields.io/npm/l/use-error-boundary.svg)

This react hook provides a ErrorBoundary class and the error state of the error boundary.

The ErrorBoundary is implemented using classes (as there is no hook-based componentDidCatch implementation yet).

### Installation

```bash
npm i use-error-boundary
```

### Functionality

The hook provides an `ErrorBoundary` class, that accepts children and renders them.
In case of an exception, the `ErrorBoundary` will render `null` and the hook will update its state.

This lets you implement an error screen depending on the Status of the Error boundary, using function components and hooks!

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

## Contributing

Contributions are welcome, as this is my **first properly published npm package**.

Feel free to open issues or pull requests! I will review them as fast as possible.
