import React, { useRef, useReducer, useCallback } from "react"

import {
  createErrorBoundary,
  UseErrorBoundaryWrapper,
} from "./create-error-boundary"

export interface ErrorState {
  didCatch: boolean
  error: any | null
}

export interface UseErrorBoundaryState extends ErrorState {
  ErrorBoundary: UseErrorBoundaryWrapper
  reset: () => void
}

interface StateAction {
  type: "catch" | "reset"
  error?: any | null
}

/**
 * useErrorBoundary hook options.
 */
export interface UseErrorBoundaryOptions {
  /**
   * Gets called when the ErrorBoundary catches an error.
   *
   * You can use this for logging or reporting errors.
   */
  onDidCatch?: (error: any, errorInfo: any) => void
}

/**
 * useErrorBoundary
 * React hook to use an ErrorBoundary in your component and keep track of the
 * error state of that boundary.
 *
 * Uses a wrapped class component to create the error Boundary, but uses hooks to keep the state
 * in your function component.
 */

type UseErrorBoundaryReducer = (
  state: ErrorState,
  action: StateAction
) => ErrorState

const useErrorBoundaryReducer: UseErrorBoundaryReducer = (state, action) => {
  switch (action.type) {
    // The component did catch, update state
    case "catch":
      return {
        didCatch: true,
        // Pass the values from action.error
        error: action.error,
      }
    case "reset":
      return {
        didCatch: false,
        error: null,
      }
    // Unknown action, return state
    default:
      return state
  }
}

function useErrorBoundary(
  options?: UseErrorBoundaryOptions
): UseErrorBoundaryState {
  // Reducer handling the error state
  const [state, dispatch] = useReducer<UseErrorBoundaryReducer>(
    useErrorBoundaryReducer,
    // Default state
    {
      didCatch: false,
      error: null,
    }
  )
  // Create ref for wrapped ErrorBoundary class
  const errorBoundaryWrapperRef = useRef<UseErrorBoundaryWrapper | null>(null)

  // Create a new wrapped boundary
  function createWrappedErrorBoundary() {
    // Create new wrapped ErrorBoundary class with onDidCatch callback
    return createErrorBoundary((err, errorInfo) => {
      // Dispatch action in case of an error
      dispatch({
        type: "catch",
        error: err,
      })

      // call onDidCatch if provided by user
      if (options && options.onDidCatch) options.onDidCatch(err, errorInfo)
    })
  }

  // Get the current ref value or initialize it with a new wrapped ErrorBoundary
  function getWrappedErrorBoundary() {
    // Get current ref value
    let errorBoundaryWrapper = errorBoundaryWrapperRef.current

    // Return the component when already initialized
    if (errorBoundaryWrapper !== null) {
      return errorBoundaryWrapper
    }

    // Update the ref with new boundary
    errorBoundaryWrapperRef.current = createWrappedErrorBoundary()

    // Return the newly created component
    return errorBoundaryWrapperRef.current
  }

  const reset = useCallback(() => {
    // create a new wrapped boundary to force a rerender
    errorBoundaryWrapperRef.current = createWrappedErrorBoundary()
    // Reset the hooks error state
    dispatch({ type: "reset" })
  }, [])

  // Return the wrapped ErrorBoundary class to wrap your components in plus the error state
  return {
    ErrorBoundary: getWrappedErrorBoundary(),
    didCatch: state.didCatch,
    error: state.error,
    reset,
  }
}

export default useErrorBoundary
