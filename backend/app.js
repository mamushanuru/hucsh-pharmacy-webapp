const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const sanitize = require('sanitize');
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};

const port = process.env.PORT;
const router = require('./routes');
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Attach the `io` instance to the `app` object
app.set('io', io);

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(sanitize.middleware);
app.use(router);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});