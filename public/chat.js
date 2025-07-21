const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let username = '';
do {
    username = prompt('Enter your username:').trim();
} while (!username);

socket.emit('set username', username);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message) {
        socket.emit('chat message', message);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const item = document.createElement('li');
    const isMine = data.username === username;

    item.innerHTML = `
        <div class="msg-container ${isMine ? 'mine' : 'theirs'}" style="color: ${data.color}">
            <div class="username">${data.username} <span class="time">${data.timestamp}</span></div>
            <div class="text">${data.text}</div>
        </div>
    `;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});
