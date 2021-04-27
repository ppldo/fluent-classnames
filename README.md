# fluent-classnames
[![NPM version](https://badgen.net/npm/v/fluent-classnames)](https://www.npmjs.com/package/fluent-classnames)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/fluent-classnames)](https://www.npmjs.com/package/fluent-classnames)
[![License](https://badgen.net/npm/license/fluent-classnames)](https://www.npmjs.com/package/fluent-classnames)

fluent-classnames (short to fcn) is less verbose (and more fluent!) version of
[classnames](https://github.com/JedWatson/classnames).

It supports CSS modules out-of-box, and also give you fully-typed experience with
[vanilla-extract](https://github.com/seek-oss/vanilla-extract)! 

## Installation
```
yarn add fluent-classnames

npm install fluent-classnames
```

## Usage and side-to-side with classnames
Given such styles:
```css
.simple {
  background: blue;
  cursor: pointer;
}
.active {
  background: green;
}
.disabled {
  background: none;
  color: gray;
  cursor: default;
}
```
There is simple react component with global styles:
```tsx
import React from 'react'
import cn from 'classnames'
//simple auto-import! Just types fcn and IDE will find it for you 
import {fcn} from 'fluent-classnames'

const SomeItem: React.FC<{isActive?: boolean, isDisabled?: boolean}> = ({isActive, isDisabled}) => <>
  
  <div className={cn('simple', {active: isActive, disabled: isDisabled})}>classnames</div>
  
  <div className={fcn(s => s.simple.active(isActive).disabled(isDisabled))}>Cooler classnames!</div>
</>
```
Less verbose, but not really shorter? So, let's look at CSS modules example:
```tsx
import React from 'react'
import cn from 'classnames'
//simple auto-import! Just types fcn and IDE will find it for you 
import {fcn} from 'fluent-classnames'

import S from './styles.module.css'

const SomeItem: React.FC<{isActive?: boolean, isDisabled?: boolean}> = ({isActive, isDisabled}) => <>
  
    <div className={cn(S.simple, {[S.active]: isActive, [S.disabled]: isDisabled})}>classnames</div>
  
    <div className={fcn(S, s => s.simple.active(isActive).disabled(isDisabled))}>Cooler classnames!</div>
</>
```
Ahh, much better, and it will be even better with longer classes chain!

Also, fcn will check for class existing in CSS module map and throws if it's not exists - no more undefined in `class`. 

There is curried form for simplicity (and some performance) sake:
```ts
import {fcn} from 'fluent-classnames'
import S from './styles.module.css'

const cn = fcn(S)

cn(s => s.simple.active(isActive).disabled(isDisabled))
cn(s => s.simple)
cn(s => s.simple.disabled)
```

And with `vanilla-extract` whole selector function is fully-typed and even prevents classes duplication:
```ts
// styles.css.ts
import { style } from '@vanilla-extract/css'

export const simple = style({
  background: 'blue',
  cursor: 'pointer',
})

export const active = style({
  background: 'green',
})

export const disabled = style({
  background: 'none',
  color: 'gray',
  cursor: 'default',
})
```

```tsx
import React from 'react'
import cn from 'classnames'
import { fcn } from 'fluent-classnames'
import * as S from './styles.css'

const SomeItem: React.FC<{isActive?: boolean, isDisabled?: boolean}> = ({isActive, isDisabled}) => <>
  
  <div className={cn(S.simple, {[S.active]: isActive, [S.disabled]: isDisabled})}>classnames</div>

  <div className={fcn(S, s => s.simple.active(isActive).disabled(isDisabled))}>Cooler classnames!</div>
</>
```

![Peek 2021-04-27 20-42](https://user-images.githubusercontent.com/4806617/116271308-4d152b80-a799-11eb-95cf-fb72b3106cd2.gif)

## Browsers support
`fcn` uses `Proxy` when it is available, but fallback to simple getters on old environments with module classes.
### It not works in global classes without proxy!

## Gotchas
- Methods and attributes from `Function` prototype (such as `name`, `call` or `apply`) can mess
  in typescript autocomplete (but it still works even if you have such classes). [TS issue](https://github.com/Microsoft/TypeScript/issues/27575)
