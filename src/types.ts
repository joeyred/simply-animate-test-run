export interface HookParams {
  /** HTMLElement passed to the AnimationSeries function. */
  element?: Element,
  /** Object containing different progresses of the animation. */
  progress?: {
    /** DO NOT USE - This will probably go away. It mostly exists for debugging */
    ms: number,
    /** Progress of entire animation series represented as a number between 0 and 1. */
    series: number,
    /** Progress of the active step represented as a number between 0 and 1. */
    step: number
  }
}

/**
 * The function called for each hook. Any assigned hook will take these params.
 *
 * @param  element   - HTMLElement object.
 * @param  progress  - Object containing different progresses of the animation.
 * @param  progress.series  - Progress of entire animation series represented as a number between 0 and 1.
 * @param  progress.currentStep - Progress of the active step represented as a number between 0 and 1.
 */
export type HookFunction = ({element, progress}: HookParams) => void;

export interface StepHooks {
  /**
   * Fires at the beginning of the step, before classes are updated, but after `beforeEachFrame`
   * when the hooks share a frame.
   */
  before?: HookFunction,
  /** Fires after classes have been updated, but after the `duringEachStep` series hook. */
  // during?: HookFunction,
  afterClassNameChange?: HookFunction,
  /** Fires at the beginning of each frame but after the `beforeEachFrame` series hook. */
  // beforeEachFrame?: HookFunction,
  // duringEachFrame?: HookFunction,
  /** Fires at the end of each frame, after all step hooks that share the frame. */
  // afterEachFrame?: HookFunction,
  onEachFrame?: HookFunction,
  /** Fires at the end of each step, but after `afterEachStep` series hook. */
  after?: HookFunction
}

export interface Hooks {
  /** Fires before the first animation frame is requested. */
  before?: HookFunction,
  /** Fires at the beginning of each step, before the css classes are updated. */
  beforeEachStep?: HookFunction,
  /** Fires after css classes are updated for each step. */
  // duringEachStep?: HookFunction,
  afterEachClassNameChange?: HookFunction,
  /** Fires before every frame. */
  // beforeEachFrame?: HookFunction,
  // duringEachFrame?: HookFunction,
  /** Fires after every frame, but before `afterEachStep` hook is fired when the hooks share a frame. */
  // afterEachFrame?: HookFunction,
  onEachFrame?: HookFunction,
  /** Fires at the end of each step, at the same time the step index is being incremented. */
  afterEachStep?: HookFunction,
  /** Fires at the end of all the steps, in place of requesting another animation frame. */
  after?: HookFunction
}

export interface Config {
  namespace?: string,
  inProgress?: string
}

export interface Step {
  /** Name of the step to be used in the CSS class name. */
  name?: string,
  /**
   * Duration of the step in frames (not ms, but will sync
   * with ms defined in any CSS transition or animation).
   */
  duration: number,
  /** Hooks specific to the animation step */
  hooks?: StepHooks,
}

export interface AnimationSeries {
  /** HTMLElement object that the animation classes will be applied to. */
  element?: Element,
  /** The first namespace in the CSS class name. defaults to `animation` or what is set using `updateConfig`. */
  namespaceClassName?: string,
  seriesClassName: string,
  hooks?: Hooks,
  steps: Step[],
}

export interface Duration {
  /** TODO DOCUMENT ME */
  stepsFiredMinusCurrent: number,
  /**
   * This acts as a way to keep track of steps being fired, and when to fire them.
   * When a step is fired, the duration of that step is added to the current duration.
   * That number can now be checked against to find out if it is time to end the current
   * step, and fire the next one, or move on to ending the animation.
   */
  stepsFired: number,
  /**
   * This is simply the total durration of the animation series.
   * When the animation begins, all the steps will be looped through, and their
   * durations will be added up to get the total.
   */
  total: number
}

export interface ClassNames {
  inProgress: string,
  current: string,
  previous: string
}
