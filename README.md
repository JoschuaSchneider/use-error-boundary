# use-error-boundary

[![npm version](https://img.shields.io/npm/v/use-error-boundary.svg)](https://www.npmjs.com/package/use-error-boundary)
![TypeScript](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)
![build workflow](https://github.com/JoschuaSchneider/use-error-boundary/actions/workflows/build.yml/badge.svg?branch=master)
![test workflow](https://github.com/JoschuaSchneider/use-error-boundary/actions/workflows/test.yml/badge.svg?branch=master)
![license](https://img.shields.io/npm/l/use-error-boundary.svg)

A **react hook** for using error boundaries in your functional components.

It lets you keep track of the error state of child components, by wrapping them in the provided `ErrorBoundary` component.

:warning: Read more about error boundaries and their intended use in the [React documentation](https://reactjs.org/docs/error-boundaries.html), this will only catch errors during the render phase!

### Installation

```bash
npm i use-error-boundary
```

```bash
yarn add use-error-boundary
```

### Breaking changes in `2.x`

While upgrading from version `1.x` make sure you are not using the `errorInfo` object.
The hook and the `renderError` callback no longer provide this object.

For advanced use, please refer to [Custom handling of error and errorInfo](#handling-error-and-errorinfo-outside-of-markup).

## Examples and usage

Import the hook:

```javascript
// Named
import { useErrorBoundary } from "use-error-boundary"
// Default
import useErrorBoundary from "use-error-boundary"
```

Learn more about the [properties that are returned](#returned-properties).

```javascript
const MyComponent = () => {

  const {
    ErrorBoundary,
    didCatch,
    error,
    reset
  } = useErrorBoundary()

  //...

}
```

### Usage without render props

Wrap your components in the provided `ErrorBoundary`.
When it catches an error the hook provides you the changed error-state and the boundary Component will render nothing.
You have to handle rendering some error display yourself.

You can get the ErrorBoundary component to render your custom error display by [using the `renderError` render-prop.](#use-with-render-props)

```javascript
const JustRenderMe = () => {
  throw new Error("💥")
}

const MyComponent = () => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()

  return (
    <>
      {didCatch ? (
        <p>An error has been caught: {error.message}</p>
      ) : (
        <ErrorBoundary>
          <JustRenderMe />
        </ErrorBoundary>
      )}
    </>
  )
}
```

### Usage with render props

Optionally, you can pass a `render` and `renderError` function to render your UI and error-state inside the boundary.

```javascript
/**
 * The renderError function also passes the error, so that you can display it using
 * render props.
 */
return (
  <ErrorBoundary
    render={() => <SomeChild />}
    renderError={({ error }) => <MyErrorComponent error={error} />}
  />
)
```

## Handling `error` and `errorInfo` outside of markup

The hook now accepts an `options` object that you can pass a `onDidCatch` callback that gets called when the ErrorBoundary catches an error. Use this for logging or reporting of errors.

```js
useErrorBoundary({
  onDidCatch: (error, errorInfo) => {
    // For logging/reporting
  },
})
```

## Returned Properties

These are the properties of the returned Object:

### `ErrorBoundary`
`Type: React Component`


Special error boundary component that provides state changes to the hook.

:warning: **You need to use this as the error boundary! Otherwise, the state will not update when errors are caught!**

The ErrorBoundary is **guaranteed referential equality** across rerenders and only updates after a reset.

### `didCatch`
`Type: boolean`

The error state, `true` if an error has ben caught.


### `error`
`Type: any | null`

The error caught by the boundary, or `null`.

### `reset`
`Type: function`

Function the reset the error state.
Forces react to recreate the boundary by creating a new ErrorBoundary

Your boundary can now catch errors again.

If you are searching for the `errorInfo` property, please read [Breaking Changes in 2.x](#breaking-changes-in-2x).

## Why should I use this hook?

React does not provide a way to catch errors within the same functional component and you have to handle that in a class Component with special lifecycle methods.

If you are new to ErrorBoundaries, building this yourself is a good way to get started!

This packages purpose is to provide an easy drop in replacement for projects that are being migrated to hooks.

This also pulls the error presentation out of the error boundary, and on the same level you are handling errors.

## Contributing

Contributions are always welcome.

Feel free to open issues or pull requests!
