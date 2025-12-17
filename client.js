const socket = io();

const msgInput = document.querySelector('#msgInput');
const sendBtn = document.querySelector('#sendBtn');

const messagesBox = document.querySelector('#messages');

sendBtn.onclick = () => {

    if (msgInput.value != ''){
        socket.emit('newMessage', msgInput.value);
        msgInput.value = '';
    }
    
};

socket.on('newMessage', (msg) => {
    const msgElem = document.createElement('div');
    msgElem.textContent = msg;
    messagesBox.appendChild(msgElem);
    messagesBox.scrollTop = messagesBox.scrollHeight;
});