import React from "react"

import {
  ErrorBoundary,
  ErrorBoundaryProps,
  OnDidCatchCallback,
} from "./ErrorBoundary"

/**
 * createErrorBoundary
 * Accepts a onDidCatch callback.
 * Creates a UseErrorBoundaryWrapper HOC, to keep the onDidCatch callback while
 * still providing the ability to pass props to the ErrorBoundary
 */

export type UseErrorBoundaryWrapper = (
  props: Omit<ErrorBoundaryProps, "onDidCatch">
) => React.ReactElement

export function createErrorBoundary(
  onDidCatch: OnDidCatchCallback
): UseErrorBoundaryWrapper {
  // Return function component that wraps ErrorBoundary and passes props to it
  return function UseErrorBoundaryWrapper(props) {
    // Return ErrorBoundary with original onDidCatch and the current props
    return React.createElement<ErrorBoundaryProps>(ErrorBoundary, {
      onDidCatch,
      children: props.children,
      render: props.render,
      renderError: props.renderError,
    })
  }
}
