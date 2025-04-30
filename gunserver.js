// Minimal Gun.js relay server using ES modules
// Save as minimal-gun-server.js

import express from 'express';
import Gun from 'gun';
import cors from 'cors';
import http from 'http';

// Basic configuration
const PORT = 3002;
const app = express();

// Minimal middleware
app.use(cors());
app.use(Gun.serve);

// Simple status endpoint
app.get('/', (req, res) => {
  res.send('Gun.js relay server running');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Gun with the server
const gun = Gun({
  web: server,
  file: 'gunjs-server-data'
});

// Start server
server.listen(PORT, () => {
  console.log(`Gun.js relay server running on http://localhost:${PORT}`);
});

// Export gun instance
export { gun };