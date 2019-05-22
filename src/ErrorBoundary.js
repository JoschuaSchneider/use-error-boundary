import { PureComponent } from "react"
import PropTypes from "prop-types"

/**
 * ErrorBoundary class
 *
 * Accepts onDidCatch callback (which will get provided when wrapped by createWrappedErrorBoundary)
 * and children (or optionally render() and renderError() functions)
 */
export class ErrorBoundary extends PureComponent {
  // Update state on error
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  // Initialize state
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null
    }
  }
  // Handle error via lifecycle method and call onDidCatch
  componentDidCatch(error, errorInfo) {
    return this.props.onDidCatch(error, errorInfo)
  }
  render() {
    const { hasError, error } = this.state
    const { render, children, renderError } = this.props

    // Prevent rendering of children that caused the error, render fallbacks instead
    if (hasError) {
      // Render either components from renderError() or nothing
      return renderError ? renderError({ ...this.props, error }) : null
    }

    // Render either components from render() or children or null
    return render ? render(this.props) : children || null
  }
}

ErrorBoundary.propTypes = {
  onDidCatch: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  render: PropTypes.func,
  renderError: PropTypes.func
}
