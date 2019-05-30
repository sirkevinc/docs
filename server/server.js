const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('new-operations', (data) => {
    io.emit("new-remote-operations", data)
  });
  console.log('a user connected');
});

http.listen(8000, () => {
  console.log('listening on 8000')
});