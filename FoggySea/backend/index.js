const app = require('express');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]
});
const users = [];
const { createGame } = require('./util/game.js');
const { updateGame } = require('./util/game.js');

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('startGame', ({ gameId }) => {
        createGame().then(tilesList => {
            io.to(gameId).emit('startGame', tilesList);
        })
    })

    socket.on('gameUpdate', ({ gameId, tilesList, clickedTile }) => {
        updateGame(tilesList, clickedTile).then(tilesList => {
            io.to(gameId).emit(gameId, tilesList);
        })
    })

    /* socket.on('gameUpdate', ({ gameId }) => {
        io.to(gameId).emit(gameId, );
    }) */
    
    socket.on('joinRoom', ({ nickname, gameId }) => {
        socket.join(gameId);
        const user = {id: socket.id, nickname, gameId};
        users.push(user);
        io.to(gameId).emit('users', users.filter(u => u.gameId === gameId));
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));