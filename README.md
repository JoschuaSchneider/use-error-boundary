# use-error-boundary

[![npm version](https://img.shields.io/npm/v/use-error-boundary.svg)](https://www.npmjs.com/package/use-error-boundary)
![build status](https://travis-ci.org/JoschuaSchneider/use-error-boundary.svg?branch=master)
![license](https://img.shields.io/npm/l/use-error-boundary.svg)

A **react hook** for using error boundaries in your functional components.

It lets you keep track of the error state of child components, by wrapping them in a provided `ErrorBoundary` component.

:warning: Read more about error boundaries and their intended use in the [React documentation](https://reactjs.org/docs/error-boundaries.html), this will only catch errors when rendering your children!

### Installation

```bash
npm i use-error-boundary
```

## Examples and usage

Import the hook:

```javascript
// Named
import { useErrorBoundary } from "use-error-boundary"
// Default
import useErrorBoundary from "use-error-boundary"
```

Please read more info on the [returned properties](#returned-properties) by the hook.

```javascript
const MyComponent = () => {

  const {
    ErrorBoundary,
    didCatch,
    error,
    errorInfo
  } = useErrorBoundary()

  ...

}
```

### Use without render props

Wrap your components in the provided `ErrorBoundary`,
if it catches an error the hook provides you with the changed state and the boundary Component will render nothing. So you have to handle rendering some error display yourself.

If you want the boundary to also render your error display, you can [use it with render props](#use-with-render-props)

```javascript

const JustRenderMe = () => {
  throw new Error('💥')
}

const MyComponent = () => {

  const {
    ErrorBoundary,
    didCatch,
    error
  } = useErrorBoundary()


  return (
    {
      didCatch ? (
        <p>An error has been catched: {error.message}</p>
      ) : (
        <ErrorBoundary>
          <JustRenderMe />
        </ErrorBoundary>
      )
    }
  )
}
```

### Use with render props

Optionally, you can pass a `render` and `renderError` function to render the components to display errors in the boundary itself:

```javascript
/**
 * The renderError function also passes the error and errorInfo, so that you can display it using
 * render props.
 */
return (
  <ErrorBoundary
    render={() => <SomeChild />}
    renderError={({ error, errorInfo }) => <MyErrorComponent error={error} />}
  />
)
```

## Returned Properties

These are the properties of the returned Object:

| Property        | Type                   | Description                                                                                                                                                                                                                                                                           |
| --------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ErrorBoundary` | React Component        | Special error boundary component that provides state changes to the hook. <br>:warning: **You need to use this as the error boundary! Otherwise, the state will not update when errors are catched!** <br> The ErrorBoundary is **guaranteed referential equality** across rerenders. |
| `didCatch`      | Boolean                | `true` if an error has been catched                                                                                                                                                                                                                                                   |
| `error`         | Error Object or `null` | The error catched by the Boundary                                                                                                                                                                                                                                                     |
| `errorInfo`     | Object or `null`       | Error Info from the boundary ([React docs](https://reactjs.org/docs/error-boundaries.html))                                                                                                                                                                                           |

## Why should I use this?

React does not provide a way to catch errors within the same component and you have to handle that in a class with special lifecycle methods.
If you are new to ErrorBoundaries, I recommend implementing this yourself!

This packages purpose is to provide an easy drop in replacement for projects that are being migrated to hooks and to pull the error presentation out of the boundary itself by putting it on the same level you are catching the errors.

## Contributing

Contributions are welcome, as this is my **first properly published npm package**.

Feel free to open issues or pull requests! I will review them as fast as possible.
