import { Worker } from 'worker_threads';

// Function to start a worker thread using async/await
async function startWorker(num) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url)); // Use URL to handle relative path in ES Modules

    worker.postMessage(num); // Send data to the worker

    worker.on('message', resolve); // Resolve the promise when the worker sends the result
    worker.on('error', reject); // Reject the promise on error
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Main logic
async function main() {
  try {
    const num = 10000000; // Example number for heavy computation
    console.log(`Starting heavy computation for ${num}`);
    const result = await startWorker(num); // Await the worker's result
    console.log(`Computation result: ${result}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); // Invoke the main function
