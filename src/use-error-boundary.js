import { useRef, useReducer } from "react"

import { createErrorBoundaryClass } from "./utils/create-error-boundary"

/**
 * useErrorBoundary
 * React hook to use an ErrorBoundary in your component and keep track of the
 * error state of that boundary.
 *
 * Uses a class component to create the error Boundary, but uses hooks to keep the state
 * in your component.
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
  // Create ref for ErrorBoundary class
  const errorBoundaryClassRef = useRef(null)

  // Get the current ref value or initialize it with a new ErrorBoundary class
  function getErrorBoundaryClass() {
    // Get current ref value
    let errorBoundaryClass = errorBoundaryClassRef.current

    // Return the current class when already initialized
    if (errorBoundaryClass !== null) {
      return errorBoundaryClass
    }

    // Create new ErrorBoundary class with onDidCatch callback
    errorBoundaryClass = createErrorBoundaryClass({
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

    // Update the ref with new class
    errorBoundaryClassRef.current = errorBoundaryClass

    // Return the newly created class
    return errorBoundaryClass
  }

  // Return the ErrorBoundary class to wrap your components in and the error state
  return {
    ErrorBoundary: getErrorBoundaryClass(),
    didCatch,
    error,
    errorInfo
  }
}
