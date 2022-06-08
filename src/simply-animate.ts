// import type * as Types from './types';
import type {
  Config,
  AnimationSeries,
  HookParams,
  ClassNames,
  Duration,
  Step
} from './types';

let config = {
  namespace:  'animation',
  inProgress: 'in-progress'
};

function updateConfig(newConfig: Config): void {
  config = Object.assign({}, config, newConfig);
}

function animationSeries({
  element,
  namespaceClassName,
  seriesClassName,
  hooks,
  steps
}: AnimationSeries): void {
  let stepIndex = 0;
  let start = 0;
  // Purely meant to be passed to the before hook, as it is fired
  // before the first animation frame is requested.
  //
  // This is also done to handle the optional passing of an HTMLElement to `element`
  const beforeHookParams: HookParams = {
    progress: {
      ms:     0,
      series: 0,
      step:   0
    }
  };

  const namespace = namespaceClassName || config?.namespace || 'animation';
  const inProgress = config?.inProgress || 'inprogess';
  const classes: ClassNames = {
    inProgress: `${namespace}__${seriesClassName}__${inProgress}`,
    current:    '',
    previous:   ''
  };
  const duration: Duration = {
    stepsFiredMinusCurrent: 0,
    // This acts as a way to keep track of steps being fired, and when to fire them.
    // When a step is fired, the duration of that step is added to the current duration.
    // That number can now be checked against to find out if it is time to end the current
    // step, and fire the next one, or move on to ending the animation.
    stepsFired:             0,
    // This is simply the total durration of the animation series.
    // When the animation begins, all the steps will be looped through, and their
    // durations will be added up to get the total.
    total:                  0
  };
  // All steps are added to this array as booleans. Everything starts as `false`,
  // and the index of the boolean in this array that matches the index of the step
  // being fired is then set to `true`.
  //
  // This is the main trick that makes the fake loop functionality work. It makes
  // sure a step is never fired more than once.
  const stepsFired: boolean[] = [];

  // If an element is passed, then add it to the object to be passed to the before hook.
  if (element) beforeHookParams.element = element;

  // Loop through the steps and put together whatever values may be needed.
  for (let i = 0; i < steps.length; i += 1) {
    // Get total duration
    duration.total += steps[i].duration;
    // build out the array of booleans
    stepsFired.push(false);
  }

  /**
   * Animation Frame
   *
   * Fired on every frame of the animation.
   *
   * @param timestamp - The timestamp in ms generated from DOMHighResTimeStamp
   */
  function animationFrame(timestamp: number): void { // eslint-disable-line complexity
    // make sure the timestamp from the first requested frame is set as `start`
    start = start === 0 ? timestamp : start;

    // The time that has elapsed since the animation series began
    const runtime = timestamp - start;
    const step: Step = steps[stepIndex];
    // This will allow for no longer needing to pass a name to each step, by setting a default.
    // If this function only needs to be used for basic hooks, then there's
    // no need for class names.
    const stepName: string = step.name ? step.name : `step-${stepIndex + 1}`;
    const stepHooks = step ? step.hooks : null;
    const hookParams: HookParams = {
      progress: {
        ms:     runtime,
        // progress of entire animation series represented as a number between 0 and 1.
        series: Math.min(runtime / duration.total, 1),
        // progress of the active step represented as a number between 0 and 1.
        step:   Math.min((runtime - duration.stepsFiredMinusCurrent) / step.duration, 1)
      }
    };
    // console.log(hookParams);

    if (element) {
      // Add element node to hook params.
      hookParams.element = element;
      // Add in progress class to element classList.
      element.classList.add(classes.inProgress);
    }

    // ================================================================== //
    // TIME TO FAKE A LOOP!
    //
    // This is used to detect when to fire each step.
    //
    // Everything in this conditional block will run for the initialization
    // of a new step.
    //
    // Condition:
    //
    // If the runtime is greater than or equal to the current duration of
    // steps so far,
    //
    // and
    //
    // the step in the current index hasnt been fired yet, then run the code for the next step.
    // ================================================================== //
    if (runtime >= duration.stepsFired && stepsFired[stepIndex] === false) {
      // Assign the current step name as the current class name after the namespaces
      classes.current = `${namespace}__${seriesClassName}__${stepName}`;

      // ======== //
      // HOOK: Before Each Step
      // ======== //
      if (hooks && hooks.beforeEachStep) hooks.beforeEachStep(hookParams);
      if (stepHooks && stepHooks.before) stepHooks.before(hookParams);

      // Remove classes if previous ones exist
      if (element && classes.previous.length > 0) element.classList.remove(classes.previous);

      // Add classes for this animation step
      if (element) element.classList.add(classes.current);

      // ======== //
      // HOOK: afterClassNameChange
      // ======== //
      if (element && hooks && hooks.afterEachClassNameChange) hooks.afterEachClassNameChange(hookParams);
      if (element && stepHooks && stepHooks.afterClassNameChange) stepHooks.afterClassNameChange(hookParams);

      // Set previous properties for the next step to use
      classes.previous = `${namespace}__${seriesClassName}__${stepName}`;

      // The step has been fired
      stepsFired[stepIndex] = true;

      // only add to the duration as long as it isnt the last step.
      if (stepIndex !== steps.length) {
        duration.stepsFiredMinusCurrent = duration.stepsFired + 0;
        duration.stepsFired += step.duration;
      }
    } // END STEP INIT

    // ======== //
    // HOOK: Before Each Frame
    // ======== //
    // if (hooks && hooks.beforeEachFrame) hooks.beforeEachFrame(hookParams);
    // if (stepHooks && stepHooks.beforeEachFrame) stepHooks.beforeEachFrame(hookParams);

    // ======== //
    // HOOK: On Each Frame
    // ======== //
    if (hooks && hooks.onEachFrame) hooks.onEachFrame(hookParams);
    if (stepHooks && stepHooks.onEachFrame) stepHooks.onEachFrame(hookParams);

    // ======== //
    // HOOK: afterEachFrame
    // ======== //
    // if (stepHooks && stepHooks.afterEachFrame) stepHooks.afterEachFrame(hookParams);
    // if (hooks && hooks.afterEachFrame) hooks.afterEachFrame(hookParams);

    // If the runtime is greater than total of the durations of steps fired,
    // then increment `stepIndex`.
    if (runtime > duration.stepsFired) {
      // ======== //
      // HOOK: afterEachStep
      // ======== //
      if (hooks && hooks.afterEachStep) hooks.afterEachStep(hookParams);
      if (stepHooks && stepHooks.after) stepHooks.after(hookParams);
      // Up the step index
      stepIndex += 1;
    }

    // Invoke the next frame as long as the total duration of the
    // animation series hasn't been exceded.
    if (runtime < duration.total) { // eslint-disable-line curly
      window.requestAnimationFrame(animationFrame);
    } else {
      // ======== //
      // HOOK: after
      // ======== //
      if (hooks && hooks.after) hooks.after(hookParams);
      // Remove all added css classes
      if (element) element.classList.remove(classes.inProgress, classes.current);
    }
  }
  // ======== //
  // HOOK: Before
  // ======== //
  if (hooks && hooks.before) hooks.before(beforeHookParams);

  // Request that first frame! Get this show on the road!!
  window.requestAnimationFrame(animationFrame);
}

const SimplyAnimate = {
  animationSeries,
  updateConfig
};

export default SimplyAnimate;
export {
  animationSeries,
  updateConfig
};
