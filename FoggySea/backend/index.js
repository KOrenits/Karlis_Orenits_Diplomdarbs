const app = require('express');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]
});
var users = [];
const { createGame } = require('./util/game.js');
const { updateGame } = require('./util/game.js');
const { addUser } = require('./util/game.js');

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('startGame', ({ gameId }) => {
        createGame().then(tilesList => {
            io.to(gameId).emit('startGame', tilesList);
        })
    });

    socket.on('gameUpdate', ({ gameId, tilesList, clickedTile }) => {
        updateGame(tilesList, clickedTile).then(tilesList => {
            io.to(gameId).emit(gameId, tilesList);
            console.log("3");
        })
    });

    /* socket.on('gameUpdate', ({ gameId }) => {
        io.to(gameId).emit(gameId, );
    }) */
    
    socket.on('joinRoom', ({ nickname, gameId }) => {
        socket.join(gameId);
        users = addUser(users, nickname, gameId);
        console.log(users);
        io.to(gameId).emit('users', users);
        console.log(`User ${nickname} joined room ${gameId}`);
        
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        const index = users.findIndex(u => u.id === socket.id);
        if (index !== -1) {
            const { nickname, gameId } = users[index];
            users.splice(index, 1);
            io.to(gameId).emit('users', users.filter(u => u.gameId === gameId));
            console.log(`User ${nickname} left room ${gameId}`);
        }
    });

    socket.on('requestUsers', ({ gameId }) => {
        io.to(gameId).emit('users', users.filter(u => u.gameId == gameId));
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));