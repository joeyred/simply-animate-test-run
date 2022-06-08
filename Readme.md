# Simply Animate

A small utility function for handling multi-step animations. Can handle everything from the most simple use cases to much more complex ones with an extremely robust hook system. All without sacrificing speed.

Currently built for use with HTMLElements, but can also just be used purely for it's hooks, making it easy to use with libraries like React, Redux, Vue, and so on.

## Getting Started

To install with npm

```bash
npm install simply-animate --save
```

To install with yarn

```bash
yarn add simply-animate
```

And pnpm
```bash
pnpm add simply-animate
```

Getting started with the `animationSeries` function is fairly simple. All you have to do is call the function, and pass step objects to it.

The easiest way to use this function is to pass an HTMLElement to it, define durations and step names for each step, and use CSS to apply whatever animations, transitions, or styles needed for each step.

```js
import { animationSeries } from 'simply-animate';

// Basic Example
animationSeries({
  element: document.getElementById('exampleThingToAnimate'),
  seriesClassName: 'series-example',
  steps: [
    {
      name: 'action-1',
      duration: 300
    },
    {
      name: 'action-2',
      duration: 400
    }
  ]
});
```

```html
<!-- HTML durring step 1 -->
<div class="animation__series-example__action-1 animation__series-example__in-progress">
  <!-- Content!! -->
</div>

<!-- HTML durring step 2 -->
<div class="animation__series-example__action-2 animation__series-example__in-progress">
  <!-- Content!! -->
</div>
```

In this example, a few classes will be added to the element passed. An "in progress" class, as well as step classes. The step classes, however, are added and removed as the series executes each step.

The "in progress" class for this example:
`.animation__series-example__in-progress`

Step 1's class:
`.animation__series-example__action-1`

Step 2's class:
`.animation__series-example__action-2`

When the series is finished, all remaining classes added will be removed.

## TypeScript
This package is written in typescript and should be compatable out-of-the-box.

However, to get access to the types and interfaces included in this package directly:
(just in case. It's an edge case, but who knows?)
```ts
import { Types } from 'simply-animate';

// Or if you have to rename
import { Types as MyNewTypes } from 'simply-animate';
```

## API

The `animationSeries` function takes an object as its argument.

| Props | Type | Required | Description |
| ----- | ---- | :------: | ----------- |
| `element` | HTMLElement |  | HTMLElement object that the animation classes will be applied to. |
| `namespaceClass` | string |  | The first namespace in the CSS class name. This is meant to allow for replacing the globally used namespace at a function by function level. |
| `seriesClassName` | string | ✅ | The function level namespace for the animation. |
| `hooks` | object |  | See function Hooks for more info. |
| `steps` | array | ✅ | An array of `Step` objects. At least one must be passed. |

## Step Object

| Props | Type | Required | Description |
| ----- | ---- | :------: | ----------- |
| `name` | string | ✅ | Name of the step to be used in the CSS class name. |
| `duration` | number | ✅ | duration of the step in milliseconds. |
| `hooks` | object | | Hooks specific to the animation step. See Step Hooks below. |

## Hooks

### Hook Order

1. **Series** - `before`
2. **Series** - `beforeEachFrame`
3. **Step** - `beforeEachFrame`
4. **Series** - `beforeEachStep`
5. **Step** - `before`
6. **Series** - `duringEachStep`
7. **Step** - `during`
8. **Series** - `afterEachFrame`
9. **Step** - `
10. **Series**


### Series Hooks (object)

These hooks apply to the entire series. Use Step Hooks to hook into individual steps in the animation series.

| Props | Type | Required | Description |
| ----- | ---- | :------: | ----------- |
| `before` | function | | Fires before the first animation frame is requested. |
| `beforeEachStep` | function | | Fires at the beginning of each step, before the css classes are updated. |
| `duringEachStep` | function | | Fires after css classes are updated for each step. |
| `onEachFrame` | function | | Fires before every frame. |
| `afterEachFrame` | function | | Fires after every frame, but before `afterEachStep` hook is fired when the hooks share a frame. |
| `afterEachStep` | function | | Fires at the end of each step, at the same time the step index is being incremented. |
| `after` | function | | Fires at the end of all the steps, in place of requesting another animation frame. |

### Step Hooks (object)

| Props | Type | Required | Description |
| ----- | ---- | :------: | ----------- |
| `before` | function | | Fires at the beginning of the step, before classes are updated, but after `beforeEachFrame` when the hooks share a frame. |
| `during` | function | | Fires after classes have been updated, but after the `duringEachStep` series hook. |
| `beforeEachFrame` | function | | Fires at the beginning of each frame but after the `beforeEachFrame` series hook.  |
| `afterEachFrame` | function | | Fires at the end of each frame, after all step hooks that share the frame. |
| `after` | function | | Fires at the end of each step, but after `afterEachStep` series hook. |

### Hook Function Param

All hook functions are passed an object as a single param.

| Props | Type | Description |
| ----- | ---- | ----------- |
| `element` | HTMLElement | Element passed to the AnimationSeries function. This will only be present if an element was passed to the `animationSeries` function. |
| `progress` | object | Object containing different progresses of the animation. |
| `progress.series` | number | Progress of entire animation series represented as a number between 0 and 1. |
| `progress.step` | number | Progress of the active step represented as a number between 0 and 1. |


## USE AT YOUR OWN RISK: Config Function

*This is mostly untested as of now, so please use at your own risk.*

The String defaults used in the css class name generation can be overwritten with the `updateConfig` function. 

***Warning*:** This is **NOT** a function by function basis, and will update values that all uses of this function will use. There may be a future update where each function can be individually configered if there is enough need for it.

The current config object has two keys. 

| Key | Type | Description |
| ----- | ---- | ----------- |
| `namespace` | string | The namespace that will be used in the animation css classes added to the passed HTMLElement |
| `inProgress` | string | The terminology that will be used when the css classes are added to allow targeting based on the animation being in progress at all |

```ts
import { updateConfig } from 'simply-animate';

updateConfig({
  namespace: 'new-namespace-name',
  inProgress: 'is-active'
});

animationSeries({
  element: document.getElementById('exampleThingToAnimate'),
  seriesClassName: 'series-example',
  steps: [
    {
      name: 'action-1',
      duration: 300
    },
    {
      name: 'action-2',
      duration: 400
    }
  ]
});
``` 

In the example above, the following classes would be generated:

The "in progress" class for this example:
`.new-namespace-name__series-example__is-active`

Step 1's class:
`.new-namespace-name__series-example__action-1`

Step 2's class:
`.new-namespace-name__series-example__action-2`