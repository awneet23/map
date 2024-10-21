// const express = require("express");
// const app = express();
// const http = require("http");
// const path = require("path");
// const socketio = require("socket.io");
// const server = http.createServer(app);
// // const { Server } = require("socket.io");

// const io = socketio(server);

// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname,'public')))
// io.on('connection',(socket)=>{
//   socket.on('send-location',(data)=>{
//     io.emit('receive-location',{id:socket.id,...data})
//   })

//   socket.on('disconnect',()=>{
//     io.emit('user-disconnected',socket.id)
//   })
//   console.log('a user')
// })

// server.listen(3000,()=>{
//   console.log('listening on port 3000')
// })

// app.get('/',(req,res)=>{
//   res.render('index')
// })





const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const users = {};

io.on('connection', (socket) => {
  console.log(`A user connected with id ${socket.id}`);

  // Add new user to the users object with initial location
  users[socket.id] = { latitude: 0, longitude: 0 };

  // Emit the current state of all users to the new client
  io.emit('initial-state', users);

  socket.on('send-location', (data) => {
    console.log(`Location received from ${socket.id}: `, data);

    // Update the user's location in the users object
    users[socket.id] = data;

    // Emit the updated location to all clients
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    // Remove the user from the users object
    delete users[socket.id];
    // Emit the user-disconnected event to all clients
    io.emit('user-disconnected', socket.id);
    console.log(`User disconnected with id ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.get('/', (req, res) => {
  res.render('index');
});
