# use-error-boundary

[![npm version](https://img.shields.io/npm/v/use-error-boundary.svg)](https://www.npmjs.com/package/use-error-boundary)
![build status](https://travis-ci.org/JoschuaSchneider/use-error-boundary.svg?branch=master)
![license](https://img.shields.io/npm/l/use-error-boundary.svg)

A **react hook** for using error boundaries in your functional components.

It lets you keep track of the error state of child components, by wrapping them in a provided `ErrorBoundary` component.

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

Use the hook in your react component,
it provides you with this object:

```javascript
const MyComponent = () => {

  const {
    ErrorBoundary, // class - The react component to wrap your children in. This WILL NOT CHANGE
    didCatch, // boolean - Whether the ErrorBoundary catched something
    error, // null or the error
    errorInfo // null or the error info as described in the react docs
  } = useErrorBoundary()

  ...

}
```

Wrap your components in the `ErrorBoundary`:

```javascript

const JustRenderMe = () => {
  throw new Error('💥')
}

const MyComponent = () => {

  ...

  /**
   * The ErrorBoundary renders its children directly,
   * when a component throws, the ErrorBoundary will return null from its render method.
   */
  return (
    <ErrorBoundary>
      <JustRenderMe />
    </ErrorBoundary>
  )
}
```

Optionally, you can pass a render() and renderError() function to render the components to display errors in the boundary itself:

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

## TODO

- [x] Extend default ErrorBoundary component to render a provided component when there is an error
- [ ] ~~Passing own component as ErrorBoundary and wrap it~~
- [x] Change ~~`createErrorBoundaryClass`~~ `createWrappedErrorBoundary` to pass `onDidCatch` as prop (HOC)
- [x] Cleanup tests
- [ ] Comment tests

## Contributing

Contributions are welcome, as this is my **first properly published npm package**.

Feel free to open issues or pull requests! I will review them as fast as possible.
