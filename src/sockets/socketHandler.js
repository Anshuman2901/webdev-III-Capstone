const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] New client connected: ${socket.id}`);

    // Join a specific room (e.g. project workspace room)
    socket.on('join:room', (roomName) => {
      socket.join(roomName);
      console.log(`[Socket.IO] Socket ${socket.id} joined room "${roomName}"`);
      socket.to(roomName).emit('room:notification', {
        message: `A team member joined ${roomName}`,
        socketId: socket.id,
      });
    });

    // Leave a room
    socket.on('leave:room', (roomName) => {
      socket.leave(roomName);
      console.log(`[Socket.IO] Socket ${socket.id} left room "${roomName}"`);
    });

    // Real-time Chat message in room
    socket.on('chat:message', (payload) => {
      const { room, message, senderName, senderRole } = payload;
      const messageData = {
        sender: senderName || 'Anonymous',
        role: senderRole || 'developer',
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };

      if (room) {
        // Broadcast to members in this room
        io.to(room).emit('chat:broadcast', messageData);
      } else {
        // Broadcast globally
        io.emit('chat:broadcast', messageData);
      }
    });

    // Typing indicator
    socket.on('typing', ({ room, userName }) => {
      socket.to(room).emit('user:typing', { userName });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
