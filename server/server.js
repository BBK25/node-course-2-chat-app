const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connnected');

socket.emit('newMessage', {
  from: 'John',
  text: 'See you then',
  createAt: 123123
});

  // socket.emit('newEmail', {
  //   from: 'mike@example.com',
  //   text: 'Hey, ..',
  //   createAt: 123
  // });

// socket.on('createEmail', (newEmail) => {
//   console.log('createEmail', newEmail);
// });

socket.on('createMessage', (message) => {
  console.log('createMessage', message);
});

  socket.on('disconnect', () => {
    console.log('User was disconnceted');
  });
});

server.listen(port, () => {
  // console.log('Server is up on port 3000');
  console.log(`Server is up on ${port}`);
});

// console.log(__dirname + '/../public');
// console.log(publicPath);
