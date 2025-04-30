// import bc from "./blockchain/blockchain.js";
// import db from "./database/database.js";

// Print cloud chain art
console.log(`
   ____ _                 _  ____ _           _       
  / ___| | ___  _   _  __| |/ ___| |__   __ _(_)_ __  
 | |   | |/ _ \\| | | |/ _\` | |   | '_ \\ / _\` | | '_ \\ 
 | |___| | (_) | |_| | (_| | |___| | | | (_| | | | | |
  \\____|_|\\___/ \\__,_|\\__,_|\\____|_| |_|\\__,_|_|_| |_|

`);

// import boxen from "boxen"
// const width = process.stdout.columns;

// console.log(boxen('Hello World!', { padding: 10, borderColor: 'green' }));
// console.log(boxen('Hello World!', { padding: 1, margin: 1, borderStyle: 'classic' }));
// console.log(boxen('Important message', {
//     borderColor: 'green',
//     backgroundColor: 'yellow',
//     borderStyle: 'bold',
//   }))
// console.log(boxen('Some info', {
//     title: 'INFO',
//     titleAlignment: 'left'
//   })
//   )

// const message = 'This box takes up the full width of your terminal!';
// const box = boxen(message, {
//   padding: 1,
//   margin: 1,
//   width: width-10,  // Set width to the terminal's width
//   borderStyle: 'double',
// });

// console.log(box);

// import blessed from "blessed"

// // Create a screen object
// const screen = blessed.screen({
//   smartCSR: true,
//   title: 'My App'
// });

// // Create a box widget
// const box = blessed.box({
//   top: 'center',
//   left: 'center',
//   width: '50%',
//   height: '50%',
//   content: 'Hello, Blessed!',
//   tags: true,
//   border: {
//     type: 'line'
//   },
//   style: {
//     fg: 'white',
//     bg: 'blue',
//     border: {
//       fg: 'green'
//     }
//   }
// });

// // Append the box to the screen
// screen.append(box);

// // Handle key events
// screen.key(['q', 'C-c'], function(ch, key) {
//   return process.exit(0); // Exit on pressing q or Ctrl+C
// });

// // Render the screen
// screen.render();

//--------------

// const input = blessed.textbox({
//     top: 2,
//     left: 'center',
//     width: '50%',
//     height: 3,
//     border: { type: 'line' },
//     style: { fg: 'white', bg: 'black' }
//   });
  
//   input.focus();
//   screen.append(input);
  
//   input.on('submit', (value) => {
//     console.log('User input:', value);
//     screen.render();
//   });
  
import enquirer from 'enquirer';
const { prompt } = enquirer;

// async function getUserInfo() {
//     const response = await prompt({
//       type: 'password',
//       choices: ['Option 1', 'Option 2', 'Option 3'],
//       name: 'username',
//       message: 'What is your username?'
//     });
  
//     console.log(`Hello, ${response.username}!`);
//   }
  
//   getUserInfo();


// async function askQuestions() {
//   const response = await prompt([
//     {
//       type: 'input',
//       name: 'name',
//       message: 'What is your name?'
//     },
//     {
//       type: 'select',
//       name: 'color',
//       message: 'Pick your favorite color',
//       choices: ['Red', 'Blue', 'Green']
//     },
//     {
//       type: 'confirm',
//       name: 'subscribe',
//       message: 'Do you want to subscribe to our newsletter?'
//     }
//   ]);

//   console.log(response);
// }

// askQuestions();

// import ora from "ora"

// const spinner = ora('Loading unicorns').start();

// setTimeout(() => {
//     spinner.color = 'yellow';
//     spinner.text = 'Loading rainbows';
// }, 1000);

// setTimeout(() => {
//     spinner.succeed('Done!');
// }, 2000);