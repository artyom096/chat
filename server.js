const express = require('express')

const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

const port = process.env.PORT || 9999

const rooms = new Map()

app.use(express.json())


app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : {
            users: [],
            messages: []
        }
    res.json(obj)
})

app.post('/rooms', (req, res) => {
    const { roomId, userName } = req.body
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['users', new Map()],
                ['messages', []]
            ])
        )
    }
    res.send()
})

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({ userName, roomId }) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.to(roomId).broadcast.emit('ROOM:JOINED', users)
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]
                socket.to(roomId).broadcast.emit('ROOM:LEAVE', users)
            }
        })
    })

    socket.on('ROOM:NEW_MESSAGE', ({ userName, roomId, text }) => {
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
    })
})

server.listen(port, err => {
    if (err) {
        throw Error(err)
    }
    console.log('Сервер запущен!');
})