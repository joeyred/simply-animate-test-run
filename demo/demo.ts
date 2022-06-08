import {animationSeries} from '../src/simply-animate';
import type {HookParams} from '../src/types';
// import {animationSeries} from './simply-animate';

import './demo.scss';

let debugData: any = [];
function clearData() {
  debugData = [];
}
function addData(data: any) {
  debugData.push(data);
}
const demoElement = document.querySelector('.animation-demo-yay');
const button =  document.querySelector('[data-animate="demo"]');
const debugButton = document.querySelector('[data-debug="output"]');
const debugSection = document.getElementById('debug');

if (button) button.addEventListener('click', () => animate());
if (debugButton) debugButton.addEventListener('click', () => injectDebugData());

const getLevel = (type: string, name: string): 'series' | 'step' | 'frame' => {
  const isSeries = type === 'series';
  const isStep = type === 'step';
  const isBeforeAfter = (name === 'before' || name === 'after');
  const isBeforeAfterStep = (name === 'beforeEachStep' || name === 'afterEachStep');
  const isDuring = (name === 'during' || name === 'duringEachStep');

  // Per Series
  if (isSeries && isBeforeAfter) return 'series';
  // Per Step
  if ((isSeries && isBeforeAfterStep) || (isStep && isBeforeAfter) || isDuring) return 'step';
  // Per Frame
  return 'frame';
};

const getCSS = (type: string, name: string):string => {
  // Level
  // series | step | frame
  const level = getLevel(type, name);
  // hookName
  // parent object
  // series | step

  return `level__${level} type__${type} hook__${name}`;
};

const generateRow = (data: any) => {
  const {
    name,
    type,
    ms,
    elapsed
  } = data;

  return `
    <tr class="${getCSS(type, name)}">
      <td class="cell__name"><span>${name}</span></td>
      <td class="cell__ms"><span>${ms.toFixed(2)}</span></td>
      <td class="cell__elapsed"><span>${elapsed}</span></td>
    </tr>
  `;
};

const outputDebugData = () => {
  let rows = '';

  for (let i = 0; i < debugData.length; i += 1) rows += generateRow(debugData[i]);

  return `<table><tbody>
      <tr class="table__header">
        <th>Hook</th>
        <th>ms</th>
        <th>elapsed</th>
      </tr>
      ${rows.toString() || ''}
    </tbody></table>`;
};

function injectDebugData() {
  // console.log(outputDebugData());
  if (debugSection) debugSection.innerHTML = outputDebugData();
}

function animate() {
  clearData();
  // let hookCount = 0;

  // const hookDebug = (msg: string) => {
  //   hookCount += 1;

  //   console.log(`${msg} - x${hookCount}`);
  // };

  const start = new Date().getTime();

  const fullDebug = (hookType: string, hookName: string, params: HookParams) => {
    // console.log(params);
    // console.log(msg);
    const ms = params?.progress?.ms || 0;
    // const step = params?.progress?.step || 0;
    // const series = params?.progress?.series || 0;
    // const {
    //   ms,
    //   series,
    //   step
    // } = params?.progress;

    const elapsed = new Date().getTime() - start;

    addData({
      name: hookName,
      type: hookType,
      ms,
      elapsed
    });

    return console.log(`${hookName} - ms: ${ms.toFixed(2)} | elapsed: ${elapsed.toFixed(2)}`);
    // return console.log(`${msg} - ms: ${ms} | series: ${series} | step: ${step}`);
  };

  const animationStepDuration = 300;

  const series = 'series';
  const step = 'step';

  return animationSeries({
    element:         demoElement || undefined,
    seriesClassName: 'hello',
    hooks:           {
      before:         (params) => fullDebug(series, 'before', params),
      beforeEachStep: (params) => fullDebug(series, 'beforeEachStep', params),
      onEachFrame:    (params) => fullDebug(series, 'onEachFrame', params),
      // duringEachStep:  (params) => fullDebug(series, 'duringEachStep', params),
      // beforeEachFrame: (params) => fullDebug(series, 'beforeEachFrame', params),
      // afterEachFrame:  (params) => fullDebug(series, 'afterEachFrame', params),
      afterEachStep:  (params) => fullDebug(series, 'afterEachStep', params),
      after:          (params) => fullDebug(series, 'after', params)
    },
    steps: [
      {
        duration: animationStepDuration,
        hooks:    {
          before:      (params) => fullDebug(step, 'before', params),
          onEachFrame: (params) => fullDebug(step, 'onEachFrame', params),
          // during:          (params) => fullDebug(step, 'during', params),
          // beforeEachFrame: (params) => fullDebug(step, 'beforeEachFrame', params),
          // afterEachFrame:  (params) => fullDebug(step, 'afterEachFrame', params),
          after:       (params) => fullDebug(step, 'after', params)
        }
      },
      {
        duration: animationStepDuration,
        hooks:    {
          before:      (params) => fullDebug(step, 'before', params),
          onEachFrame: (params) => fullDebug(step, 'onEachFrame', params),
          // during:          (params) => fullDebug(step, 'during', params),
          // beforeEachFrame: (params) => fullDebug(step, 'beforeEachFrame', params),
          // afterEachFrame:  (params) => fullDebug(step, 'afterEachFrame', params),
          after:       (params) => fullDebug(step, 'after', params)
        }
      }
    ]
  });
}

// animationSeries({
//   seriesClassName: 'demo',
//   hooks:           {
//     before: () => fullDebug('before!'),
//     after:  () => fullDebug('after!')
//   },
//   steps: [
//     {
//       name:     'hello',
//       duration: 300
//     }
//   ]
// });
