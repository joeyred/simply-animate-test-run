import {mockRAF, resetRAFTime} from './util/mockRAF';
import {animationSeries} from '../simply-animate';
// eslint-disable-next-line no-undef
const j = jest;

const template = `
<div>
  <div id="animate" class="test-element">Hello World</div>
</div>
`;

// const stepClassName = (stepName) => `animation__hello__${stepName}`;
const makeClassString = (seriesName: string) =>
  (stepName: string) => `animation__${seriesName}__${stepName}`;

window.requestAnimationFrame = mockRAF;

// const properHookOrder = [
//   'series:before',
//   'series:before'
// ]
// const getOrderOfFunctionsFired = (name) => {}

describe('animationSeries', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    // jest.spyOn(window, 'requestAnimationFrame').mockImplementation();
    // document.body.insertAdjacentHTML('beforeend', template);
    // document.body.innerHTML = template;
  });
  afterEach(() => {
    // window.requestAnimationFrame.mockRestore();
    j.useRealTimers();
    resetRAFTime();
  });

  // test hookParams object values
  // // when element is passed (line 69 & line 111)

  // test classList changes
  it('Should apply classList changes to a passed Element', (done) => {
    document.body.innerHTML = template;
    const testElement = document.getElementById('animate');
    let frames = 0;

    const stepClassString = makeClassString('hello');
    j.useFakeTimers();
    j.spyOn(global, 'setTimeout');

    animationSeries({
      element:         testElement,
      seriesClassName: 'hello',
      hooks:           {
        onEachFrame: ({progress}) => {
          console.log(`ms: ${progress.ms} | frame: ${(frames += 1)}`);
          console.table(testElement.classList);
        }
      },
      steps: [
        {
          duration: 100
        },
        {
          duration: 100
        },
        {
          duration: 100
        }
      ]
    });
    j.advanceTimersByTime(10);
    console.log(testElement.classList.contains('test-element'));
    console.table(testElement.classList);

    expect(testElement.classList.contains(stepClassString('step-1'))).toBe(true);
    expect(testElement.classList.contains(stepClassString('in-progress'))).toBe(true);
    j.advanceTimersByTime(120);

    console.table(testElement.classList);
    expect(testElement.classList.contains(stepClassString('step-1'))).toBe(false);
    expect(testElement.classList.contains(stepClassString('step-2'))).toBe(true);
    expect(testElement.classList.contains(stepClassString('in-progress'))).toBe(true);

    j.advanceTimersByTime(120);

    console.table(testElement.classList);
    expect(testElement.classList.contains(stepClassString('step-2'))).toBe(false);
    expect(testElement.classList.contains(stepClassString('step-3'))).toBe(true);
    expect(testElement.classList.contains(stepClassString('in-progress'))).toBe(true);

    j.advanceTimersByTime(120);

    console.table(testElement.classList);
    expect(testElement.classList.contains(stepClassString('step-3'))).toBe(false);
    expect(testElement.classList.contains(stepClassString('in-progress'))).toBe(false);
    done();
  });
  // // happen at all
  // // happen in correct order
  // // everything gone after animation is finished
  // // in-progress added and removed

  it('should import', () => {
    expect(animationSeries).toBeTruthy();
  });

  it('should run in most basic form', () => {
    animationSeries({
      seriesClassName: 'hello',
      steps:           [
        {
          duration: 500
        }
      ]
    });
  });
  // css classes should update properly

  it('Should fire the before hook', () => {
    // eslint-disable-next-line no-undef
    const mockCallback = jest.fn(() => 1);

    animationSeries({
      seriesClassName: 'testBefore',
      hooks:           {
        before: () => mockCallback()
      },
      steps: [
        {
          duration: 200
        }
      ]
    });

    expect(mockCallback.mock.calls.length).toBe(1);
  });
  // run hooks in order
  // it('Should run when element is passed');
  it('Should properly execute hooks', () => {
    let timesFired = 0;
    // eslint-disable-next-line no-undef
    j.useFakeTimers();
    // eslint-disable-next-line no-undef
    j.spyOn(global, 'setTimeout');
    // eslint-disable-next-line no-undef
    const shouldFire = j.fn((fired = false) => {
      timesFired += 1;
      console.log(timesFired);
      return expect(fired).toBe(true);
    });

    animationSeries({
      seriesClassName: 'hello',
      hooks:           {
        before:         () => shouldFire(true),
        beforeEachStep: () => shouldFire(true),
        // afterEachClassNameChange: () => {},
        onEachFrame:    () => shouldFire(true),
        afterEachStep:  () => shouldFire(true),
        after:          () => shouldFire(true)
      },
      steps: [
        {
          duration: 100,
          hooks:    {
            before:      () => shouldFire(true),
            // during: () => mockCallback(),
            onEachFrame: () => shouldFire(true),
            after:       () => shouldFire(true)
          }
        }
      ]
    });
    j.advanceTimersByTime(140);
  });
});
