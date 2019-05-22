import React from "react"

import { ErrorBoundary } from "../ErrorBoundary"

/**
 * createWrappedErrorBoundary
 * Accepts an object with a onDidCatch callback.
 * Creates a UseErrorBoundaryWrapper HOC, to keep the onDidCatch callback while
 * still providing the ability to pass props to the ErrorBoundary
 * @param {object} options
 */
export function createWrappedErrorBoundary({ onDidCatch }) {
  // Return function component that wraps ErrorBoundary and passes props to it
  return function UseErrorBoundaryWrapper(props) {
    // Return ErrorBoundary with original onDidCatch and the current props
    return <ErrorBoundary onDidCatch={onDidCatch} {...props} />
  }
}
