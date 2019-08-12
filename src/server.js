const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const routes = require('./routes')

const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectdUsers = {}

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectdUsers[user] = socket.io
  
  console.log(user, socket.id)
})

mongoose.connect('mongodb+srv://goweek8:goweek8@cluster0-exb7x.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;
  req.connectdUsers = connectdUsers;

  return next;
})

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(3333)