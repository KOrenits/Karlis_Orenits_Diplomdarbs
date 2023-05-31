const app = require('express');
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]
});

var users = {};
var shipsCount = {};
var usersGameSettings = {};

const { createGame, updateGame, addUser, createNewHost, getRandomInt, convertShipTypes } = require('./util/game.js');
const { getGameSettingsById, getGameSettingsCount } = require('./util/database.js');

io.on("connection", (socket) => {

  socket.on('startGame', ({ gameId, isGameStarted }) => {
    getGameSettingsCount().then((count)=>{
      var settingsId = getRandomInt(count) + 1;
        getGameSettingsById(settingsId).then((gameSettings) => {
          usersGameSettings[gameId] = [];
          usersGameSettings[gameId] = gameSettings
          usersGameSettings[gameId] = convertShipTypes(usersGameSettings[gameId]);    
          createGame(usersGameSettings[gameId]).then(({tilesList, currentShipsCount}) => {
            shipsCount[gameId] = []; 
          shipsCount[gameId].push(currentShipsCount);
          io.to(gameId).emit('startGame', {tilesList, isGameStarted });
        });
      }) 
    });
  });

  socket.on('gameUpdate', ({ gameId, tilesList, clickedTile, usersList, currentUser, isGameOver }) => {
    currentShipsCount = shipsCount[gameId];
    gameSettings = usersGameSettings[gameId];
    updateGame(tilesList, clickedTile, usersList, currentUser, isGameOver , currentShipsCount, gameSettings ).then(({ tilesList, usersList, currentUser, isGameOver , currentShipsCount }) => {
      shipsCount[gameId] = currentShipsCount;
      if (shipsCount[gameId] == 0) {
        delete shipsCount[gameId];
      }
      io.to(gameId).emit('gameUpdate', { tilesList, usersList, currentUser, isGameOver });
    });
  });
  
  socket.on('joinRoom', ({ nickname, gameId }) => {
      socket.join(gameId);
      if (!users[gameId]) 
      {
        users[gameId] = [];
      }
      var user = addUser(users[gameId], nickname);
      users[gameId].push(user);
      users[gameId] = createNewHost(users[gameId]);
      usersList = users[gameId];
      io.to(gameId).emit('users', usersList);
  });

  socket.on('requestUsers', ({ gameId }) => {
      io.to(gameId).emit('users', users[gameId] || []);
    });

  socket.on('leave', ({usersList, leavingUser, gameId }) => {
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
    }   
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => console.log('Server is running on port ' + PORT));