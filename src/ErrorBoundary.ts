import { PureComponent } from "react"

export type ErrorObject = {
  error: any
}

/**
 * Internal callback, used to link the hook state to the boundary state.
 */
export type OnDidCatchCallback = (error: any, errorInfo: any) => void

/**
 * Props of the internal ErrorBoundary component.
 *
 * onDidCatch is used internally.
 * children, render and renderError are public facing and get utilized by the UseErrorBoundaryWrapper.
 */
export interface ErrorBoundaryProps {
  onDidCatch: OnDidCatchCallback
  children?: React.ReactNode | JSX.Element
  render?: () => React.ReactNode | JSX.Element
  renderError?: (error: ErrorObject) => React.ReactNode | JSX.Element
}

/**
 * Internal ErrorBoundary state.
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error: any
}

/**
 * ErrorBoundary class
 *
 * Catches errors using lifecycle methods and renders fallback ui using children or render props.
 */
export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  /**
   * Initialize component state.
   */
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  /**
   * Set error state when the boundary catches.
   */
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  /**
   * Use componentDidCatch lifecycle method to report the error using
   * the onDidCatch prop.
   */
  componentDidCatch(error: any, errorInfo: any) {
    return this.props.onDidCatch(error, errorInfo)
  }

  /**
   * Render children or fallback ui depending on the error state.
   *
   * Uses render props api if either render or renderError is defined.
   */
  render() {
    const { hasError, error } = this.state
    const { render, children, renderError } = this.props

    // Prevent rendering of children that caused the error, render fallbacks instead
    if (hasError) {
      // Render either components from renderError() or nothing
      return renderError ? renderError({ error }) : null
    }

    // Render either components from render() or children or null
    return render ? render() : children || null
  }
}
