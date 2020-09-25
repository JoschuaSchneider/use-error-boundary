import React from "react"
import { render, screen } from "@testing-library/react"

import { ErrorBoundary } from "../ErrorBoundary"

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

/**
 * Test ErrorBoundary component
 */

test("[No Error] Renders children from props.children", async () => {
  const onDidCatch = jest.fn()

  render(
    <ErrorBoundary onDidCatch={onDidCatch}>
      <p>Children</p>
    </ErrorBoundary>
  )

  expect(screen.getByText("Children")).toBeInTheDocument()
  // No errors should be catched here!
  expect(onDidCatch).toHaveBeenCalledTimes(0)
  expect(console.error).toHaveBeenCalledTimes(0)
})

test("[No Error] Renders children from props.render()", async () => {
  const onDidCatch = jest.fn()

  render(
    <ErrorBoundary onDidCatch={onDidCatch} render={() => <p>Children</p>} />
  )

  expect(screen.getByText("Children")).toBeInTheDocument()
  // No errors should be catched here!
  expect(onDidCatch).toHaveBeenCalledTimes(0)
  expect(console.error).toHaveBeenCalledTimes(0)
})

test("[Error] Renders nothing on error (props.children) and calls onDidCatch", async () => {
  const onDidCatch = jest.fn()

  const { container } = render(
    <ErrorBoundary onDidCatch={onDidCatch}>
      <p>Children</p>
      <Explosion />
    </ErrorBoundary>
  )

  expect(container).toBeEmptyDOMElement()
  // React and testing-library calls console.error when a boundary catches, onDidCatch should be called
  expect(onDidCatch).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledTimes(2)
})

test("[Error] Renders nothing on error (props.render())", async () => {
  const onDidCatch = jest.fn()

  const { container } = render(
    <ErrorBoundary
      onDidCatch={onDidCatch}
      render={() => (
        <>
          <p>Children</p>
          <Explosion />
        </>
      )}
    />
  )

  expect(container).toBeEmptyDOMElement()
  // React and testing-library calls console.error when a boundary catches
  expect(console.error).toHaveBeenCalledTimes(2)
})

test("[Error] Renders props.renderError()", async () => {
  const onDidCatch = jest.fn()

  render(
    <ErrorBoundary
      onDidCatch={onDidCatch}
      render={() => (
        <>
          <p>Children</p>
          <Explosion />
        </>
      )}
      renderError={({ error }) => <p>{error.message}</p>}
    />
  )

  expect(screen.getByText(ExplosionErrorMessage)).toBeInTheDocument()
  // React and testing-library calls console.error when a boundary catches
  expect(console.error).toHaveBeenCalledTimes(2)
})
