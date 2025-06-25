const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const socketio= require("socket.io");
const io = socketio(server);
const connect = require('./config/database-config');
const Chat = require('./models/chat');

io.on('connection', (socket) => {

  socket.on('join_room', (data)=>{
    socket.join(data.roomid);
  });

  socket.on('send_message', async (data)=>{
    const chat = await Chat.create({
      roomId: data.roomid,
      user: data.username,
      content: data.msg
    })
    io.to(data.roomid).emit('msg_received', data);
  });

  socket.on('typing', (data) =>{
    socket.broadcast.to(data.roomid).emit('someone_typing');
  });

});

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));

app.get('/chat/:roomid', async (req, res)=>{
  const chats = await Chat.find({
    roomId: req.params.roomid
  }).select('content user');
  
  res.render('index', {
    id: req.params.roomid,
    chats: chats
  });
})
server.listen(3000, async ()=>{
  await connect();
  console.log('Database connected');
  console.log('Server started');
})