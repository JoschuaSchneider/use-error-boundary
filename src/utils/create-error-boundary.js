import { PureComponent } from "react"
import PropTypes from "prop-types"

/**
 * createErrorBoundaryClass
 * Accepts an object with a onDidCatch callback.
 * Creates an ErrorBoundary class that calls the given callback with error and errorInfo
 * in case the component catches an error
 * @param {object} options
 */
export function createErrorBoundaryClass({ onDidCatch }) {
  /**
   * ErrorBoundary Class component implementing componentDidCatch,
   * Uses the onDidCatch callback to inform the hook logic about an error
   */
  class ErrorBoundary extends PureComponent {
    // Setup initial state to keep track of an error
    constructor(props) {
      super(props)
      this.state = { hasError: false }
    }
    // Update state when an error has occured
    static getDerivedStateFromError() {
      return { hasError: true }
    }
    // Call onDidCatch to inform the hook logic
    componentDidCatch(error, errorInfo) {
      return onDidCatch(error, errorInfo)
    }
    // Return children or null in case of an error
    render() {
      if (this.state.hasError) {
        return null
      }
      return this.props.children || null
    }
  }

  // Error boundary PropTypes
  ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.any
    ]).isRequired
  }

  // Return the ErrorBoundary class
  return ErrorBoundary
}
