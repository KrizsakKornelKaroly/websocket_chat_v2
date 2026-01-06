const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path');

const ROOMS = [
    { id: 'frontend', label: 'Frontend programozás' },
    { id: 'backend', label: 'Backend programozás' },
    { id: 'desktop', label: 'Asztali alkalmazás fejlesztés' },
    { id: 'mobile', label: 'Mobil alkalmazás fejlesztés' },
    { id: 'database', label: 'Adatbázis kezelés' },
    { id: 'others', label: 'Egyéb témák' },
]

const ERRORS = {
    missingFields: 'Hiányzó belépési adatok!'
}

const getRoomById = (roomId) => { return ROOMS.find((room) => room.id === roomId)};

const connectedUsers = new Map();

const emitRoomUsers = (room) => {
    const usersInRoom = Array.from(connectedUsers.values())
        .filter(user => user.room === room)
        .map(user => user.nickname);
    io.to(room).emit('room-users', {users: usersInRoom});
}

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const {error = '', nickname = '', room = ''} = req.query;
    res.render('index', { rooms: ROOMS, error: ERRORS[error], nickname, room });
});

app.get('/main', (req, res) => {
    const { nickname, room} = req.query;
    
    if (!nickname || !room) {
        return res.redirect(`/?error=missingFields&nickname=${nickname}&room=${room}`);
    }

    const chatConfig = {
        nickname,
        roomId: room,
        roomLabel: getRoomById(room).label,
    } 

    res.render('main', { chatConfig });
});

io.on('connection', (socket)=>{
    console.log(`Új felhasználó csatlakozott: ${socket.id}`);

    socket.on('join-room', ({nickname, room})=> {
        connectedUsers.set(socket.id, {nickname, room});
        socket.join(room);
        socket.to(room).emit('system-message', `${nickname} csatlakozott a beszélgetéshez.`);
        emitRoomUsers(room);
    });

    socket.on('leave-room', ({nickname, room}) => {
        socket.to(room).emit('system-message', `${nickname} kilépett a beszélgetésből.`);
        connectedUsers.delete(socket.id);
        socket.disconnect();
        emitRoomUsers(room);
    });

    socket.on('send-message', ({message}) => {
        const user = connectedUsers.get(socket.id);
        io.to(user.room).emit('chat-message', {
            nickname: user.nickname,
            message
        }); 
    });
});

server.listen(3000, ()=>{
    console.log(`http://localhost:3000`);
});