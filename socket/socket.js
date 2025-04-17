// socket/socket.js
const setupSocket = (io) => {
    io.on('connection', (socket) => {
      console.log(`⚡ User connected: ${socket.id}`);
  
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
      });
  
      // مثال: استقبال رسالة
      socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
      });
    });
  };
  
  export default setupSocket;
  