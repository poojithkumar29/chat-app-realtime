const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const userColors = {};
const userNames = {};

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4D03F', '#8E44AD', '#E67E22', '#1ABC9C'];
    return colors[Math.floor(Math.random() * colors.length)];
}

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    userColors[socket.id] = getRandomColor();

    socket.on('set username', (username) => {
        userNames[socket.id] = username;
    });

    socket.on('chat message', (msg) => {
        const username = userNames[socket.id] || 'Anonymous';
        io.emit('chat message', {
            username,
            text: msg,
            color: userColors[socket.id],
            timestamp: new Date().toLocaleTimeString()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userNames[socket.id];
        delete userColors[socket.id];
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
