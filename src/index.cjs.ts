// Workaround for mixing named and default exports, see https://github.com/developit/microbundle/issues/712
import useErrorBoundary from "./use-error-boundary"
Object.assign(useErrorBoundary, { useErrorBoundary })
export default useErrorBoundary
