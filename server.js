const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path');
const { get } = require('http');

const ROOMS = [
    { id: 'frontend', label: 'Frontend programozás' },
    { id: 'backend', label: 'Backend programozás' },
    { id: 'desktop', label: 'Asztali alkalmazás fejlesztés' },
    { id: 'mobile', label: 'Mobil alkalmazás fejlesztés' },
    { id: 'database', label: 'Adatbázis kezelés' },
    { id: 'other', label: 'Egyéb témák' }
];

const ERRORS = {
    missingFields: 'Kérlek, tölts ki minden mezőt!',
};

const getRoomById = (roomId) => {
    return ROOMS.find(room => room.id === roomId);
}


app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    const { error = '', nickname = '', room = '' } = req.query;
    res.render('index', { rooms: ROOMS, error: ERRORS[error], nickname, room });
});


app.get('/main', (req, res) => {
    const { nickname, room } = req.query;
    if (!nickname || !room) {
        return res.redirect('/?error=missingFields&nickname=' + nickname + '&room=' + room);
    }

    const chatConfig = {
        nickname,
        roomId: getRoomById(room).id,
        roomLabel: getRoomById(room).label
    }

    res.render('main', { chatConfig });
});


io.on('connection', (socket) => {
    console.log('Új felhasználó csatlakozott: ' + socket.id);

    socket.on('join-room', ( nickname, room) => {
        socket.join(room);
        socket.to(room).emit('system-message', `${nickname} csatlakozott a szobához.`);
    });

    socket.on('leave-room', ( nickname, room ) => {
        socket.to(room).emit('system-message', `${nickname} elhagyta a szobát.`);
        socket.disconnect();
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});