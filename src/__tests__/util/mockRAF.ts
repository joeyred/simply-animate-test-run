let time = 0;
let handle = 0;
const timeBetweenFrames = 10;

export function mockRAF(callback: FrameRequestCallback): number {
  handle += 1;
  setTimeout(() => {
    time += timeBetweenFrames;
    callback(time);
  }, timeBetweenFrames);
  return handle;
}

export function resetRAFTime(): void {
  time = 0;
}
