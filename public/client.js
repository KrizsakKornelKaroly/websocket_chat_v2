const socket = io();

const config = window.CHAT_CONFIG;
const leaveRoomBtn = document.getElementById('leaveRoom');
const messagesUl = document.getElementById('messages');

leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leave-room', {
        nickname: config.nickname,
        room: config.roomId
    });
    window.location.href = '/?nickname=' + config.nickname;
});



const renderMessage = (nickname, message, type) => {
    const timestamp = new Date().toLocaleTimeString();
    const li = document.createElement('li');
    if (nickname === 'Rendszer') {
        li.classList.add('fst-italic');
        li.style.fontSize = '0.9em';
        li.style.color = 'gray';
    }
    li.innerHTML = `<div><small>${timestamp}</small> - <span>${nickname}</span>: <span>${message}</span></div>`;
    messagesUl.appendChild(li);
};


socket.emit('join-room', {
    nickname: config.nickname,
    room: config.roomId
})

socket.on('system-message', (msg) => {
    renderMessage('Rendszer', msg, 'incoming');
});
