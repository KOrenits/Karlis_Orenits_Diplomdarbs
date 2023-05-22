const app = require('express');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]
});
var users = {};
const { createGame } = require('./util/game.js');
const { updateGame } = require('./util/game.js');
const { addUser } = require('./util/game.js');
const {createNewHost } = require('./util/game.js');

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('startGame', ({ gameId, isGameStarted }) => {
        createGame().then(tilesList => {
            io.to(gameId).emit('startGame', {tilesList, isGameStarted });
        })
    });

    socket.on('gameUpdate', ({ gameId, tilesList, clickedTile, usersList, currentUser }) => {
        console.log(usersList);
        updateGame(tilesList, clickedTile, usersList, currentUser).then(({ tilesList, usersList, currentUser }) => {
          console.log(currentUser);
          console.log(usersList);
          io.to(gameId).emit(gameId, { tilesList, usersList, currentUser });
        });
      });

    /* socket.on('gameUpdate', ({ gameId }) => {
        io.to(gameId).emit(gameId, );
    }) */
    
    socket.on('joinRoom', ({ nickname, gameId }) => {
        socket.join(gameId);
        if (!users[gameId]) {
            users[gameId] = []; // Create an empty array for users of a new game ID
          }
          var user = addUser(users[gameId], nickname, gameId);
        if(user != 1)
        {
            users[gameId].push(user);
        }
        io.to(gameId).emit('users', users[gameId]);
        console.log(`User ${nickname} joined room ${gameId}`);
        
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        Object.keys(users).forEach((gameId) => {
          const index = users[gameId].findIndex(u => u.socketId === socket.id);
          if (index !== -1) {
            const { nickname } = gameUsers[gameId][index];
            gameUsers[gameId].splice(index, 1);
            io.to(gameId).emit('users', gameUsers[gameId]);
            console.log(`User ${nickname} left room ${gameId}`);
          }
        });
      });

    socket.on('requestUsers', ({ gameId }) => {
        io.to(gameId).emit('users', users[gameId] || []);
      });

      socket.on('leave', ({usersList, leavingUser, gameId }) => {
        console.log("leave");
        console.log(leavingUser);
        // Find the user in the users array and remove them
        console.log(usersList)
        
        const disconnectedUser = users[gameId].find((user) => user.playerId === leavingUser.playerId);
        if (disconnectedUser) {
          const userIndex = users[gameId].indexOf(disconnectedUser);
          users[gameId].splice(userIndex, 1);
          if(leavingUser.playerId == 0){
            createNewHost(users[gameId]);
          }
          io.to(gameId).emit('users', users[gameId]);   
        }
        
        console.log(users[gameId]);
      });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));