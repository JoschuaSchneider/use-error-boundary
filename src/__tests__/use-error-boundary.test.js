import React from "react"
import { shallow, mount } from "enzyme"
import sinon from "sinon"

import { useErrorBoundary } from "../"

import { createWrappedErrorBoundary } from "../utils/create-wrapped-error-boundary"
import { ErrorBoundary as ErrorBoundaryClass } from "../ErrorBoundary"

function HookDataWrapper({ hook }) {
  const hookData = hook ? hook() : null

  return <div hookdata={hookData} />
}

function getHookData() {
  const dataWrapper = shallow(<HookDataWrapper hook={useErrorBoundary} />)

  const { hookdata } = dataWrapper.find("div").props()

  return hookdata
}

describe("useErrorBoundary() hook", () => {
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

  describe("createWrappedErrorBoundary() factory", () => {
    it("should return a function", () => {
      const wrappedFunction = createWrappedErrorBoundary({
        onDidCatch: () => {}
      })

      expect(typeof wrappedFunction).toBe("function")
    })

    it("should not call onDidCatch", () => {
      const onDidCatch = sinon.spy()

      createWrappedErrorBoundary({
        onDidCatch
      })

      expect(onDidCatch.notCalled).toBeTruthy()
    })

    it("should render <ErrorBoundary /> and pass onDidCatch to it", () => {
      const onDidCatch = function() {}

      const WrappedErrorClass = createWrappedErrorBoundary({
        onDidCatch
      })

      const wrappedErrorBoundary = shallow(<WrappedErrorClass />)

      const errorBoundary = wrappedErrorBoundary.find("ErrorBoundary")

      expect(errorBoundary.exists()).toBeTruthy()
      expect(errorBoundary.prop("onDidCatch")).toBe(onDidCatch)
    })

    it("should pass props on Wrapper to <ErrorBoundary />", () => {
      const onDidCatch = function() {}

      const WrappedErrorClass = createWrappedErrorBoundary({
        onDidCatch
      })

      const wrappedErrorBoundary = shallow(
        <WrappedErrorClass someprop="somevalue" />
      )

      const errorBoundary = wrappedErrorBoundary.find("ErrorBoundary")

      expect(errorBoundary.exists()).toBeTruthy()
      expect(errorBoundary.prop("someprop")).toBe("somevalue")
    })
  })

  describe("<ErrorBoundary /> class", () => {
    it("should render without crashing", () => {
      const errorBoundary = mount(<ErrorBoundaryClass onDidCatch={() => {}} />)

      expect(errorBoundary.exists()).toBeTruthy()
    })

    it("should initialize its own state", () => {
      const errorBoundary = mount(<ErrorBoundaryClass onDidCatch={() => {}} />)

      expect(errorBoundary.state("hasError")).toEqual(false)
      expect(errorBoundary.state("error")).toEqual(null)
    })

    it("should return components in render() function", () => {
      function Child() {
        return "child"
      }
      const errorBoundary = mount(
        <ErrorBoundaryClass onDidCatch={() => {}} render={() => <Child />} />
      )

      expect(errorBoundary.find(Child).exists()).toBeTruthy()
    })

    it("should return its children", () => {
      function Child() {
        return "child"
      }
      const errorBoundary = mount(
        <ErrorBoundaryClass onDidCatch={() => {}}>
          <Child />
        </ErrorBoundaryClass>
      )

      expect(errorBoundary.find(Child).exists()).toBeTruthy()
    })

    it("should catch errors in children, update state and call onDidCatch once with error", () => {
      function BadChild() {
        return "bad child"
      }

      const onDidCatch = sinon.spy()

      const errorBoundary = shallow(
        <ErrorBoundaryClass onDidCatch={onDidCatch}>
          <BadChild />
        </ErrorBoundaryClass>
      )

      const simulatedError = new Error("simulated")

      errorBoundary.find(BadChild).simulateError(simulatedError)

      expect(errorBoundary.exists()).toBeTruthy()
      expect(errorBoundary.find(BadChild).exists()).toBeFalsy()
      expect(onDidCatch.callCount).toEqual(1)
      expect(onDidCatch.calledWith(simulatedError)).toBeTruthy()

      expect(errorBoundary.state("hasError")).toEqual(true)
      expect(errorBoundary.state("error")).toEqual(simulatedError)
    })

    it("should render renderError() when catching", () => {
      function BadChild() {
        return "bad child"
      }

      function ErrorChild() {
        return "this shows when catched"
      }

      const errorBoundary = shallow(
        <ErrorBoundaryClass
          onDidCatch={() => {}}
          renderError={() => <ErrorChild />}
        >
          <BadChild />
        </ErrorBoundaryClass>
      )

      const simulatedError = new Error("simulated")

      errorBoundary.find(BadChild).simulateError(simulatedError)

      expect(errorBoundary.exists()).toBeTruthy()
      expect(errorBoundary.find(BadChild).exists()).toBeFalsy()
      expect(errorBoundary.find(ErrorChild).exists()).toBeTruthy()
    })
  })
})
