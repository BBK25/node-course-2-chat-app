const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

// socket.emit('newMessage', {
//   from: 'Admin',
//   text: 'Welcome to the chat app'
// });

socket.on('join', (params, callback) => {
  if (!isRealString(params.name) || !isRealString(params.room)) {
    return callback('Name and room name are required.');
  }

  socket.join(params.room);
  users.removeUser(socket.id);
  users.addUser(socket.id, params.name, params.room);

  io.to(params.room).emit('updateUserList', users.getUserList(params.room));
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
  socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
  callback();
});

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

socket.on('createMessage', (message, callback) => {
  var user = users.getUser(socket.id);

  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }

  // console.log('createMessage', message);
  callback('This is from the server.');

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

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    // console.log('User was disconnceted');
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  // console.log('Server is up on port 3000');
  console.log(`Server is up on ${port}`);
});

// console.log(__dirname + '/../public');
// console.log(publicPath);
