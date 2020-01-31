const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const {generateMessage, generateLocationMessage} = require('./model/messages.js')
const {addUser, removeUser, getUser, getUserList} = require('./model/users.js')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
const publicDir = path.join(__dirname, '../public')
const io = socketio(server)    

app.use(express.static(publicDir))

io.on('connection', (socket) => {
    console.log('New websocket connection')

    socket.on('join', ({username, roomId}, callback ) => {
        const {error, user} = addUser(socket.id, username, roomId)
        if(error) {
            return callback(error)
        }
        socket.join(user.roomId)
        socket.emit('message', generateMessage('Admin', 'Welcome! Enjoy your chat over here!'))
        socket.broadcast.to(user.roomId).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.roomId).emit('sidebar-content', {
            roomId: user.roomId,
            userList: getUserList(user.roomId)
        })
        callback()
    })
    
    socket.on('sendMessage', (message , callback) => {
        const user = getUser(socket.id)
        if(!user){
            return callback('this is an error')
        }
        io.to(user.roomId).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords , callback) => {
        const user = getUser(socket.id)
        if(!user) {
            return callback(user)
        }
        io.to(user.roomId).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        // console.log('either this was called of enforced!')
        const {removedUser, error} = removeUser(socket.id)
        if(error) {
            return console.log(error)
        }
        io.to(removedUser.roomId).emit('message', generateMessage('Admin', `${removedUser.username} just disconnected!`))
        io.to(removedUser.roomId).emit('sidebar-content', {
            roomId: removedUser.roomId,
            userList: getUserList(removedUser.roomId)
        })
    })
    
})

server.listen(port, ()=> {
    console.log('Server is up on port'+ port)
})