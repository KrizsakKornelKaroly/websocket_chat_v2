const socket = io();

const config = window.CHAT_CONFIG;

const leaveRoomBtn = document.getElementById('leaveRoom');
const messageInput = document.getElementById('newMessage');
const newMessageBtn = document.getElementById('newMessageBtn');
const messagesList = document.getElementById('messages');
const usersListBox = document.getElementById('usersList');

const renderMessage = ( nickname, message, type) => {
    timestamp = new Date().toLocaleTimeString();

    const li = document.createElement('li');
    li.innerHTML = `<div class="${type}">
    <small>${timestamp}</small> - <span>${nickname}</span>: <span>${message}</span>
    </div>`;
    if (type === 'system'){
        li.classList.add('fst-italic');
        li.classList.add('systemMsg');
        li.style.fontSize = '0.9em';
        li.style.color = 'gray';
    }
    messagesList.appendChild(li);
    messagesList.parentElement.scrollTop = messagesList.parentElement.scrollHeight;

}

const renderUsers = (users) => {
    usersListBox.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersListBox.appendChild(li);
    });
}

leaveRoomBtn.addEventListener('click', ()=>{
    socket.emit('leave-room', { nickname: config.nickname, room: config.roomId });
    window.location.href=`/?nickname=${config.nickname}`;
});

newMessageBtn.addEventListener('click', ()=>{
    const msg = messageInput.value.trim();
    if (!msg){
        return;
    }
    socket.emit('send-message', { message: msg });
    messageInput.value = '';
    messageInput.focus();
});

socket.emit('join-room', { nickname: config.nickname, room: config.roomId });

socket.on('system-message', (msg) => {
    renderMessage('Rendszer üzenet', msg, 'system');
});

socket.on('chat-message', ({nickname, message}) => {
    renderMessage(nickname, message, 'incoming');
});

socket.on('room-users', ({users}) => {
    renderUsers(users);
});