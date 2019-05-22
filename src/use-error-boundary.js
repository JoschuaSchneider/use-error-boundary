import { useRef, useReducer } from "react"

import { createWrappedErrorBoundary } from "./utils/create-wrapped-error-boundary"

/**
 * useErrorBoundary
 * React hook to use an ErrorBoundary in your component and keep track of the
 * error state of that boundary.
 *
 * Uses a wrapped class component to create the error Boundary, but uses hooks to keep the state
 * in your function component.
 */
export function useErrorBoundary() {
  // Reducer handling the error state
  const [{ didCatch, error, errorInfo }, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        // The component did catch, update state
        case "catch":
          return {
            ...state,
            didCatch: true,
            // Pass the values from action.error and action.errorInfo
            error: action.error,
            errorInfo: action.errorInfo
          }
        // Unknown action, return state
        default:
          return state
      }
    },
    // Default state
    {
      didCatch: false,
      error: null,
      errorInfo: null
    }
  )
  // Create ref for wrapped ErrorBoundary class
  const errorBoundaryWrapperRef = useRef(null)

  // Get the current ref value or initialize it with a new wrapped ErrorBoundary
  function getWrappedErrorBoundary() {
    // Get current ref value
    let errorBoundaryWrapper = errorBoundaryWrapperRef.current

    // Return the component when already initialized
    if (errorBoundaryWrapper !== null) {
      return errorBoundaryWrapper
    }

    // Create new wrapped ErrorBoundary class with onDidCatch callback
    errorBoundaryWrapper = createWrappedErrorBoundary({
      // onDidCatch callback
      onDidCatch(err, errInfo) {
        // Dispatch action in case of an error
        dispatch({
          type: "catch",
          error: err,
          errorInfo: errInfo
        })
      }
    })

    // Update the ref with new component
    errorBoundaryWrapperRef.current = errorBoundaryWrapper

    // Return the newly created component
    return errorBoundaryWrapper
  }

  // Return the wrapped ErrorBoundary class to wrap your components in plus the error state
  return {
    ErrorBoundary: getWrappedErrorBoundary(),
    didCatch,
    error,
    errorInfo
  }
}
