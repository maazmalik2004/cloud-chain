// import Gun from 'gun';
// import http from 'http';

// // Create an HTTP server first
// const server = http.createServer();

// // Hardcode the peers - main peer we want to sync with
// const PEERS = ['http://localhost:3000/gun'];

// // Start Gun on the current port
// const PORT = process.env.PORT || 3001;

// // Setup Gun with the HTTP server
// const gun = Gun({
//   file: `persistent-store-${PORT}`, // Use port in filename to avoid conflicts
//   peers: PEERS,
//   web: server // Pass the HTTP server instance to Gun
// });

// // Start the server listening
// server.listen(PORT, () => {
//   console.log(`Peer started on port ${PORT}`);
//   console.log(`Connecting to peers: ${PEERS.join(', ')}`);
// });

// // Get the blockchain node
// const blockchain = gun.get('blockchain');

// // Listen for updates to the blockchain node
// blockchain.on((data, key) => {
//   // The 'on' callback provides the data and the key
//   console.log('Blockchain update received:', data);
// });

// // Example: Initialize the blockchain with a value if needed
// // blockchain.once((data) => {
// //   if (!data) {
// //     console.log('Blockchain node not found, initializing with a genesis block');
// //     blockchain.put({
// //       blocks: [{
// //         index: 0,
// //         timestamp: Date.now(),
// //         data: "Genesis Block",
// //         previousHash: "0"
// //       }]
// //     });
// //   } else {
// //     console.log('Connected to existing blockchain:', data);
// //   }
// // });

// // Example: Add a new block every 10 seconds (uncomment to use)
// /*
// setInterval(() => {
//   blockchain.once((data) => {
//     // Create a simple new block
//     const newBlock = {
//       index: (data?.blocks?.length || 0) + 1,
//       timestamp: Date.now(),
//       data: `Block data at ${new Date().toISOString()}`,
//       previousHash: "hash-would-go-here"
//     };
    
//     // Update by extending the existing data
//     const updatedData = data || {};
//     updatedData.blocks = updatedData.blocks || [];
//     updatedData.blocks.push(newBlock);
    
//     console.log(`Adding new block with index ${newBlock.index}`);
//     blockchain.put(updatedData);
//   });
// }, 10000);
// */

// // Keep process running
// console.log('Peer running and syncing with Gun network...');

import Gun from 'gun';

// Hardcode the peers
const PEERS = ['http://localhost:3000/gun','http://localhost:3001/gun'];

// Start Gun on the current port
const PORT = process.env.PORT || 3001;
const gun = Gun({ 
  file: `peer_data_${PORT}`, 
  peers: PEERS, 
  listen: PORT  // Using listen as in your working example
});

console.log(`Peer started on port ${PORT}`);
console.log(`Connecting to peers: ${PEERS.join(', ')}`);

// Get reference to the blockchain node
const blockchain = gun.get('blockchain');
const registry = gun.get('registry')

// Listen for updates to the blockchain
blockchain.on((data) => {
  console.log('Blockchain update received:', JSON.stringify(JSON.parse(data.data),null,4));
});

registry.on((data) => {
    console.log('Registry update received:', JSON.stringify(JSON.parse(data.data),null,4));
  });

// // Initialize blockchain if needed
// blockchain.once(data => {
//   if (!data) {
//     console.log('Blockchain node not found, initializing with a genesis block');
//     blockchain.put({
//       blocks: [{
//         index: 0,
//         timestamp: Date.now(),
//         data: "Genesis Block",
//         previousHash: "0"
//       }]
//     });
//   } else {
//     console.log('Connected to existing blockchain:', data);
//   }
// });

// // Example: Add a new block every 10 seconds
// setInterval(() => {
//   blockchain.once((data) => {
//     if (!data || !data.blocks) {
//       console.log('Cannot add block: blockchain not initialized');
//       return;
//     }
    
//     // Create a simple new block
//     const blocks = data.blocks || [];
//     const newBlock = {
//       index: blocks.length,
//       timestamp: Date.now(),
//       data: `Block data at ${new Date().toISOString()}`,
//       previousHash: "hash-would-go-here"
//     };
    
//     // Add the new block
//     blocks.push(newBlock);
    
//     console.log(`Adding new block with index ${newBlock.index}`);
//     blockchain.put({ blocks: blocks });
//   });
// }, 10000);

console.log('Peer running and syncing with Gun network...');