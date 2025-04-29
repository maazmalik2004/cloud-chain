import { parentPort } from 'worker_threads';

function heavyComputation(num) {
  let result = 0;
  for (let i = 0; i < num; i++) {
    result += i;
  }
  return result;
}

parentPort.on('message', (num) => {
  const result = heavyComputation(num);
  parentPort.postMessage(result);
});
