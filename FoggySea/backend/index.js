const app = require('express');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]
});
var users = {};
var shipsCount = {};
var GameStartedArray = {};
const { createGame } = require('./util/game.js');
const { updateGame } = require('./util/game.js');
const { addUser } = require('./util/game.js');
const {createNewHost } = require('./util/game.js');

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('startGame', ({ gameId, isGameStarted }) => {
      createGame().then(({tilesList,currentShipsCount}) => {
        if (!shipsCount[gameId]) {
          shipsCount[gameId] = []; // Initialize as an empty array if it doesn't exist
        }
        if(!GameStartedArray[gameId])
        {
          GameStartedArray[gameId] = isGameStarted;
        } 
        shipsCount[gameId].push(currentShipsCount);
        io.to(gameId).emit('startGame', {tilesList, isGameStarted });
      });    
    });

    socket.on('gameUpdate', ({ gameId, tilesList, clickedTile, usersList, currentUser, isGameOver }) => {
      currentShipsCount = shipsCount[gameId];
        updateGame(tilesList, clickedTile, usersList, currentUser, isGameOver , currentShipsCount).then(({ tilesList, usersList, currentUser, isGameOver , currentShipsCount }) => {
          shipsCount[gameId] = currentShipsCount;
          if (shipsCount[gameId] == 0) {
            delete shipsCount[gameId];
          }
          io.to(gameId).emit('gameUpdate', { tilesList, usersList, currentUser, isGameOver });
        });
        
      });
    
    socket.on('joinRoom', ({ nickname, gameId }) => {
        socket.join(gameId);
        if (!users[gameId]) {
            users[gameId] = []; // Create an empty array for users of a new game ID
          }
          var user = addUser(users[gameId], nickname);
        if(user != 1)
        {
            users[gameId].push(user);
            users[gameId] = createNewHost(users[gameId]);
        }
        usersList = users[gameId];
        io.to(gameId).emit('users', usersList);
        console.log(`User ${nickname} joined room ${gameId}`);
    });

  /*   socket.on('disconnect', () => {
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
      }); */
      socket.on('currentState', ({ gameId }) => {
        const isGameStarted = GameStartedArray[gameId];
        console.log(isGameStarted)
        io.to(gameId).emit('currentState', { isGameStarted });
      });

    socket.on('requestUsers', ({ gameId }) => {
        io.to(gameId).emit('users', users[gameId] || []);
      });

      socket.on('leave', ({usersList, leavingUser, gameId }) => {
        // Find the user in the users array and remove them
        users[gameId] = usersList;
        const disconnectedUser = users[gameId].find((user) => user.playerId == leavingUser.playerId);
        if (disconnectedUser) 
        {
          const userIndex = users[gameId].indexOf(disconnectedUser);
          users[gameId].splice(userIndex, 1);
          if(users[gameId].length > 0)
          {
            users[gameId] = createNewHost(users[gameId]);
          }
          if (users[gameId].length == 0) 
          {
            delete users[gameId];
          }
          usersList = users[gameId];
          io.to(gameId).emit('users', usersList);  
          //console.log(users[gameId]); 
        }
        
      });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));

/* const serverIP = 19216921364;
const serverPort = 3000;

httpServer.listen(serverPort, serverIP, () => {
  console.log(`Server is running on ${serverIP}:${serverPort}`);
}); */