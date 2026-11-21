const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const config = require('./config/env');
const connectDB = require('./config/db');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorMiddleware');
const socketHandler = require('./sockets/socketHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Initialize Express App
const app = express();

// Create Core HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Attach io instance to express app for controller access
app.set('io', io);
socketHandler(io);

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(loggerMiddleware);

// Serve Static Frontend UI
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint with student capstone details
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'CollabFlow API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    student: {
      name: config.student.name,
      rollNo: config.student.rollNo,
      course: config.student.course,
    },
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Catch 404 & Forward to Error Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    server.listen(config.port, () => {
      console.log('====================================================');
      console.log(` CollabFlow Capstone Platform running on port ${config.port}`);
      console.log(` Student: ${config.student.name} | Roll No: ${config.student.rollNo}`);
      console.log(` Environment: ${config.env}`);
      console.log(` Local URL: http://localhost:${config.port}`);
      console.log(` Health Check: http://localhost:${config.port}/api/v1/health`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGINT Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Gracefully shutting down HTTP server and database...');
  server.close(() => {
    console.log('HTTP and WebSocket server closed.');
    process.exit(0);
  });
});

if (require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };
