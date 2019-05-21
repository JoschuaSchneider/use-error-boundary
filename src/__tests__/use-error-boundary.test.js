import React from "react"
import { shallow, mount } from "enzyme"

import { useErrorBoundary } from "../"

function HookDataWrapper({ hook }) {
  const hookData = hook ? hook() : null

  return <div hookdata={hookData} />
}

function getHookData() {
  const dataWrapper = shallow(<HookDataWrapper hook={useErrorBoundary} />)

  const { hookdata } = dataWrapper.find("div").props()

  return hookdata
}

describe("useErrorBoundary hook", () => {
  it("should render in a function component without crashing", () => {
    const wrapper = shallow(<HookDataWrapper hook={useErrorBoundary} />)

    expect(wrapper.exists()).toBeTruthy()
  })

  it("should initialize state", () => {
    const { ErrorBoundary, didCatch, error, errorInfo } = getHookData()

    expect(typeof ErrorBoundary).toBe("function")
    expect(didCatch).toBe(false)
    expect(error).toBeNull()
    expect(errorInfo).toBeNull()
  })

  it("should return correct state after catch and not throw", () => {
    function BadChild() {
      return null
    }

    function HookDataWrapperWithBoundary() {
      const { ErrorBoundary, ...state } = useErrorBoundary()

      return (
        <>
          <div hookdata={{ ErrorBoundary, ...state }} />
          <ErrorBoundary>
            <BadChild />
          </ErrorBoundary>
        </>
      )
    }

    const dataWrapperWithBoundary = shallow(<HookDataWrapperWithBoundary />)

    function getCurrentHookData() {
      return dataWrapperWithBoundary.find("div").props().hookdata
    }

    const errorBoundary = dataWrapperWithBoundary
      .find("ErrorBoundary")
      .shallow()

    const simulatedError = new Error("Simulated error")

    errorBoundary.find(BadChild).simulateError(simulatedError)

    const { didCatch, error, errorInfo } = getCurrentHookData()

    expect(didCatch).toBe(true)
    expect(error).toBe(simulatedError)
    expect(errorInfo).not.toBeNull()
  })

  describe("ErrorBoundary component returned by hook", () => {
    it("should render without crashing", () => {
      const { ErrorBoundary } = getHookData()

      const errorBoundary = mount(
        <ErrorBoundary>
          <div>children</div>
        </ErrorBoundary>
      )

      expect(errorBoundary.exists()).toBeTruthy()
    })

    it("should initialize its own state", () => {
      const { ErrorBoundary } = getHookData()

      const errorBoundary = mount(
        <ErrorBoundary>
          <div>children</div>
        </ErrorBoundary>
      )

      expect(errorBoundary.state("hasError")).toEqual(false)
    })

    it("should catch errors from children and not render children", () => {
      const { ErrorBoundary } = getHookData()

      function Stub() {
        return null
      }

      const errorBoundary = mount(
        <ErrorBoundary>
          <Stub />
        </ErrorBoundary>
      )

      errorBoundary.find(Stub).simulateError(new Error("Simulated Error"))

      expect(errorBoundary.state("hasError")).toEqual(true)
      expect(errorBoundary.children()).toEqual({})
    })
  })
})
