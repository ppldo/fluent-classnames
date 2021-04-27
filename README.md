## About
Adding multiple class names for one element

Dynamic setting of the class name depending on the condition

## Installation
```
yarn add fluent-classnames
```

## Usage
###1. CSS Modules
Example styles:
```css
/*styles.css*/
  .root {
    padding: 10px;
  }

  .active {
    background: green;
  }

  .someClass {
    background: blue;
  }
```

Add className with fluent-classnames:
```tsx
// example.tsx
import { fcn } from 'fluent-classnames'
import S from './styles.css'

class ExampleComp extends React.Component<{
  isActive?: boolean
}> {
  render() {
    const {isActive} = this.props
    return (
      <div className={fcn(S, s => s.root)}>
        <div className={fcn(S, s => s.someClass)}>
          test1
        </div>
        <div className={fcn(S, s => s.active(isActive).someClass)}>
          test2
        </div>
      </div>
    )
  }
}
```
###2. vanilla-extract
```ts
// styles.css.ts
import { style } from '@vanilla-extract/css'

export const root = style({
  padding: '10px'
})

export const active = style({
  background: 'green',
})

export const someClass = style({
  background: 'blue',
})
```

```tsx
// example.tsx
import { fcn } from 'fluent-classnames'
import * as S from './styles.css'

class ExampleComp extends React.Component<{
  isActive?: boolean
}> {
  render() {
    const {isActive} = this.props
    return (
      <div className={fcn(S, s => s.root)}>
        <div className={fcn(S, s => s.someClass)}>
          test1
        </div>
        <div className={fcn(S, s => s.active(isActive).someClass)}>
          test2
        </div>
      </div>
    )
  }
}
```
###3. global style
```css
  .root {
    padding: 10px;
  }

  .active {
    background: green;
  }

  .someClass {
    background: blue;
  }
```

```tsx
// example.tsx
import { fcn } from 'fluent-classnames'

class ExampleComp extends React.Component<{
  isActive?: boolean
}> {
  render() {
    const {isActive} = this.props
    return (
      <div className={fcn(s => s.root)}>
        <div className={fcn(s => s.someClass)}>
          test1
        </div>
        <div className={fcn(s => s.active(isActive).someClass)}>
          test2
        </div>
      </div>
    )
  }
}
```
