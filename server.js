const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('Új felhasználó csatlakozott: ' + socket.id);
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});