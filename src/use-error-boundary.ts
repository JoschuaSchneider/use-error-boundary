import React, { useRef, useReducer } from "react"

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
}

interface StateAction {
  type: "catch"
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
        //...state,
        didCatch: true,
        // Pass the values from action.error
        error: action.error,
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

  // Get the current ref value or initialize it with a new wrapped ErrorBoundary
  function getWrappedErrorBoundary() {
    // Get current ref value
    let errorBoundaryWrapper = errorBoundaryWrapperRef.current

    // Return the component when already initialized
    if (errorBoundaryWrapper !== null) {
      return errorBoundaryWrapper
    }

    // Create new wrapped ErrorBoundary class with onDidCatch callback
    errorBoundaryWrapper = createErrorBoundary((err, errorInfo) => {
      // Dispatch action in case of an error
      dispatch({
        type: "catch",
        error: err,
      })

      // call onDidCatch if provided by user
      if (options && options.onDidCatch) options.onDidCatch(err, errorInfo)
    })

    // Update the ref with new component
    errorBoundaryWrapperRef.current = errorBoundaryWrapper

    // Return the newly created component
    return errorBoundaryWrapper
  }

  // Return the wrapped ErrorBoundary class to wrap your components in plus the error state
  return {
    ErrorBoundary: getWrappedErrorBoundary(),
    didCatch: state.didCatch,
    error: state.error,
  }
}

export default useErrorBoundary
