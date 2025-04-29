import Gun from 'gun';

// Hardcode the peers
const PEERS = ['http://localhost:3000/gun', 'http://localhost:3001/gun'];

// Start Gun on the current port (3000 or 3001)
const PORT = process.env.PORT || 3001;
const gun = Gun({ 
  file: `peer_data_${PORT}`, 
  peers: PEERS, 
  listen: PORT
});

console.log(`Peer started on port ${PORT}`);
console.log(`Connecting to peers: ${PEERS.join(', ')}`);

// Reference shared counter
const counter = gun.get('shared_counter');

// Initialize if needed
counter.once(data => {
  if (!data || typeof data.value !== 'number') {
    console.log('Counter not found, initializing to 0');
    counter.put({ value: 0 });
  } else {
    console.log('Counter exists with value', data.value);
  }
});

// Every 5 seconds, increment by 10
setInterval(() => {
  counter.once(data => {
    const currentValue = data?.value || 0;
    const newValue = currentValue + 10;
    console.log(`Incrementing counter: ${currentValue} -> ${newValue}`);
    counter.put({ value: newValue });
  });
}, 5000);

// Listen to changes (optional, for logging)
counter.on(data => {
  console.log('Counter updated:', data?.value);
});
