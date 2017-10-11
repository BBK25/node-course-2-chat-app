const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const{generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connnected');

// socket.emit('newMessage', {
//   from: 'Admin',
//   text: 'Welcome to the chat app'
// });

socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
// socket.broadcast.emit('newMessage', {
//   from: 'Admin',
//   text: 'New user joined',
//   createAt: new Date().getTime()
// });

// socket.emit('newMessage', {
//   from: 'John',
//   text: 'See you then',
//   createAt: 123123
// });

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
  io.emit('newMessage', generateMessage(message.from, message.text));
  // console.log('createMessage', message);
  // io.emit('newMessage', {
  //   from: message.from,
  //   text: message.text,
  //   createdAt: new Date().getTime()
  // });
  // socket.broadcast.emit('newMessage', {
  //   from: message.from,
  //   text: message.text,
  //   createdAt: new Date().getTime()
  // });
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
