import React, { useState } from "react"
import { act, render, screen, fireEvent } from "@testing-library/react"
import useErrorBoundary from "../index"
import { UseErrorBoundaryOptions } from "../use-error-boundary"
import { renderHook } from "@testing-library/react-hooks"

/**
 * Mock console and suppress errors.
 */
let consoleSpy: jest.SpyInstance | null = null

beforeEach(() => {
  consoleSpy = jest.spyOn(console, "error").mockImplementation()
})

afterEach(() => {
  consoleSpy?.mockRestore()
})

/**
 * Helper Components
 */

const ExplosionErrorMessage = "💥"
const Explosion = () => {
  throw new Error(ExplosionErrorMessage)
}

// Use to test hook behaviour
function ClickToExplode(options?: UseErrorBoundaryOptions) {
  const [explode, setExplode] = useState(false)
  const { ErrorBoundary, didCatch, error } = useErrorBoundary(options)

  return (
    <>
      <div data-testid="boundary-inside">
        <ErrorBoundary>
          {explode ? (
            <Explosion />
          ) : (
            <button onClick={() => setExplode(true)}>Explode!</button>
          )}
        </ErrorBoundary>
      </div>
      <p data-testid="didcatch">{didCatch ? "true" : "false"}</p>
      <p data-testid="error-message">{error?.message}</p>
    </>
  )
}

// Use to test render props of wrapped ErrorBoundary
function InstantExplosion(options?: UseErrorBoundaryOptions) {
  const { ErrorBoundary } = useErrorBoundary(options)

  return (
    <>
      <div data-testid="boundary-inside">
        <ErrorBoundary
          render={() => <Explosion />}
          renderError={({ error }) => (
            <p data-testid="error-message">{error.message}</p>
          )}
        />
      </div>
    </>
  )
}

/**
 * Test useErrorBoundary hook
 */

test("Hook initializes state", async () => {
  const { result } = renderHook(() => useErrorBoundary())

  expect(result.current.didCatch).toBe(false)
  expect(result.current.ErrorBoundary).toBeDefined()
  expect(result.current.error).toBe(null)
})

test("Wrapped ErrorBoundary catches error", async () => {
  const onDidCatch = jest.fn()

  render(<ClickToExplode onDidCatch={onDidCatch} />)

  act(() => {
    fireEvent.click(screen.getByText("Explode!"))
  })

  // Boundary should render nothing
  expect(screen.getByTestId("boundary-inside")).toBeEmptyDOMElement()
  // Hook should provide didCatch and error
  expect(screen.getByTestId("didcatch")).toHaveTextContent("true")
  expect(screen.getByTestId("error-message")).toHaveTextContent(
    ExplosionErrorMessage
  )
  // Provided callback should be called once
  expect(onDidCatch).toBeCalledTimes(1)
  // React and testing-library calls console.error when a boundary catches
  expect(console.error).toHaveBeenCalledTimes(2)
})

test("Wrapped ErrorBoundary catches error with render props", async () => {
  const onDidCatch = jest.fn()

  render(<InstantExplosion onDidCatch={onDidCatch} />)

  // Hook should provide didCatch and error
  expect(screen.getByTestId("error-message")).toBeInTheDocument()
  expect(screen.getByTestId("error-message")).toHaveTextContent(
    ExplosionErrorMessage
  )
  // Provided callback should be called once
  expect(onDidCatch).toBeCalledTimes(1)
  // React and testing-library calls console.error when a boundary catches
  expect(console.error).toHaveBeenCalledTimes(2)
})
