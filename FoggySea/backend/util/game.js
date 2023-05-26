
/* const tileTypes = Object.freeze({
    default: Symbol("default"),
    ship: Symbol("ship"),
    empty: Symbol("empty"),
    goldenShip: Symbol("goldenShip"),
    pirate: Symbol("pirate"),
    mermaid: Symbol("mermaid"),
    kraken: Symbol("kraken")
})  */



const tileTypes = Object.freeze({
    default: "default",
    ship: "ship",
    empty: "empty",
    goldenShip: "goldenShip",
    pirate: "pirate",
    mermaid: "mermaid",
    kraken: "kraken"
})


var shipsList = []
var tilesList = []


var tempTileList = []
var tempShip = []
var earnedPoints;
var tempCurrentShipsCount;
var gameSettings = [];

function createGame(tempGameSettings) {
    return new Promise(function (resolve,reject){
        gameSettings = tempGameSettings;
        shipsList = [];
        tempTileList = [];
        tempShip = [];
        this.tilesList = [];
        for (var y = 0; y < gameSettings.gameRows; y++)
        {
            var columns = [];
            for(var x = 0; x < gameSettings.gameColumns; x++)
            {
            var object = {
            isPossibleShipTile: true,
            canPutShip: true,
            tileType: tileTypes.default,
            selected: false,
            x: x,
            y: y,
            shipId: 0
            }
            columns.push(object)
            }
            this.tilesList.push(columns)
        }
        
        createShips();
        createGoldenShips();
        createKrakens();
        createMermaids();
        createPirates(); 
        resolve({tilesList: this.tilesList, currentShipsCount: gameSettings.shipTypes.length});
    });
}

function controlIfShipDestroyed(clickedTile){
    var currentShip = [];
    var currentTile = [];
    this.tilesList.forEach(ship =>{
        ship.forEach(tile =>{
            if(tile.shipId == clickedTile.shipId)
            {
                currentShip.push(tile);
            }
            if(JSON.stringify(tile) == JSON.stringify(clickedTile))
            {
                currentTile = tile;
            }         
        });
    }); 
    currentTile.selected = true;
    if(currentTile.tileType == tileTypes.default)
    {
        currentTile.tileType = tileTypes.empty
    }
    else if (currentTile.tileType == tileTypes.ship || currentTile.tileType == tileTypes.goldenShip)
    {
        if(currentTile.tileType == tileTypes.ship)
        {
            earnedPoints = 1;
        }
        else
        {
            earnedPoints = 2;
        }
        var shipIsDestroyed = true;
        currentShip.forEach(tile =>{
        if (!tile.selected )
        {
            shipIsDestroyed = false;
        }
        });
        if (shipIsDestroyed)
        {
            findNecessaryShipBorderOrExpansionTiles(currentShip, 2);
            tempCurrentShipsCount = tempCurrentShipsCount - 1;
        }
    } 

    if (tempCurrentShipsCount == 0)
    {
        tempIsGameOver = true;   
        fillRestOfRemainingTiles();
    }
        
}


function  fillRestOfRemainingTiles(){
    for (var y = 0; y < gameSettings.gameRows; ++y)
    {
        for (var x = 0; x < gameSettings.gameColumns; ++x)
        {
        this.tilesList[y][x].selected = true;
        if(this.tilesList[y][x].tileType == tileTypes.default)
        {
            this.tilesList[y][x].tileType = tileTypes.empty;
        }
        }
    }
    }
    
function createShips(){
    var shipId = 1;
    for(var i=0; i < gameSettings.shipTypes.length; i++)
    {
        var makeThisShipAgain = true;
        while(makeThisShipAgain)
        {
            var x = getRandomInt(gameSettings.gameRows);
            var y = getRandomInt(gameSettings.gameColumns);
            tempTileList = [];
            tempShip = [];
            if(this.tilesList[y][x].canPutShip == true)
            {
                this.tilesList[y][x].tileType = tileTypes.ship;
                this.tilesList[y][x].canPutShip = false;
                tempShip.push(this.tilesList[y][x]);
                if(gameSettings.shipTypes[i] == 1)
                {
                    makeThisShipAgain = false;
                    addShipId(tempShip, shipId);
                    findNecessaryShipBorderOrExpansionTiles(tempShip, 1);
                }
                else
                {
                    var j = 1;
                    while (j < gameSettings.shipTypes[i])
                    {
                        if (selectNearTilesToExtendShip(tempShip))
                        {
                            selectNextShipTile(tempTileList);
                            j++;
                        }
                        else
                        {
                            tempShip.forEach(shipTile =>{
                            shipTile.tileType = tileTypes.default;
                            shipTile.canPutShip = true;
                            j = gameSettings.shipTypes[i] + 30;
                            makeThisShipAgain = true;
                            });
                        }
                        if (j == gameSettings.shipTypes[i])
                        {
                            makeThisShipAgain = false;
                            addShipId(tempShip, shipId);
                            findNecessaryShipBorderOrExpansionTiles(tempShip, 1);
                        }
                    }
                }
            }
        }
        shipId = shipId + 1;
        shipsList.push(tempShip);
    }
}

function addShipId (tempShip, shipId)
{
    tempShip.forEach(shipTile => {
        shipTile.shipId = shipId;
    });
}

function selectNextShipTile(tempList) {
    var index = getRandomInt(tempList.length);
    tempList[index].tileType = tileTypes.ship;
    tempList[index].canPutShip = false;
    tempShip.push(tempList[index]);
    }

function findNecessaryShipBorderOrExpansionTiles(tempShip, methodType) {
    tempShip.forEach(shipTile => {
        var xMax = shipTile.x + 1;
        var xMin = shipTile.x - 1;
        for (; xMin <= xMax; xMin++)
        {
        var yMax = shipTile.y + 1;
        var yMin = shipTile.y - 1;
        for (; yMin <= yMax; yMin++)
        {
            if(tileOnBounds(yMin, xMin))
            {
            if (methodType == 0 && (shipTile.x == xMin || shipTile.y == yMin))
            {
                //Find Ship Tiles for ship extension
                if (this.tilesList[yMin][xMin].tileType == tileTypes.default && this.tilesList[yMin][xMin].canPutShip && this.tilesList[yMin][xMin].isPossibleShipTile)
                {
                this.tilesList[yMin][xMin].isPossibleShipTile = false;
                tempTileList.push(this.tilesList[yMin][xMin]);
                }
            }
            else
            {
                //Find Ship Border Tiles
                if (this.tilesList[yMin][xMin].tileType != tileTypes.ship)
                {
                    if (methodType == 1)
                        this.tilesList[yMin][xMin].canPutShip = false;
                    else if (methodType == 2)
                    {
                        this.tilesList[yMin][xMin].selected = true;
                        if(this.tilesList[yMin][xMin].tileType == tileTypes.default)
                        {
                            this.tilesList[yMin][xMin].tileType = tileTypes.empty;
                        }
                    }
                }
            }
            }
        }
        }
    }); 
    }

function selectNearTilesToExtendShip (tempShip){
    tempTileList = [];
    findNecessaryShipBorderOrExpansionTiles(tempShip, 0);
    clearPosibleShipTiles(tempTileList);
        if (tempTileList.length != 0)
            return true;

        return false;
    }

function  clearPosibleShipTiles(tempList){
    tempList.forEach(temp =>
    {
        temp.isPossibleShipTile = true;
    });
    }


function  tileOnBounds(y, x){
    if (x >= 0 && x < gameSettings.gameRows && y >= 0 && y < gameSettings.gameColumns)
        return true;

    return false;
    }
    
function  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
    }

function  createSpecialTiles(validationTileType, tileType, count){
    tempTileList = [];
    for (var y = 0; y < gameSettings.gameRows; ++y)
    {
        for (var x = 0; x < gameSettings.gameColumns; ++x)
        {
        if (this.tilesList[y][x].tileType == validationTileType)
            tempTileList.push(this.tilesList[y][x]);
        }
    }
    for (var i = 0; i < count; i++)
    {
        var index = getRandomInt(tempTileList.length);
        tempTileList[index].canPutShip = false;
        tempTileList[index].tileType = tileType;
        tempTileList.splice(index, 1);
    }
    }

function  createMermaids()
    {
    createSpecialTiles(tileTypes.default, tileTypes.mermaid, gameSettings.mermaids);
    }

function  createPirates()
    {
    createSpecialTiles(tileTypes.default, tileTypes.pirate, gameSettings.pirates);
    }

function  createKrakens()
    {
    createSpecialTiles(tileTypes.default, tileTypes.kraken, gameSettings.krakens);
    }

function  createGoldenShips()
    {
    createSpecialTiles(tileTypes.ship, tileTypes.goldenShip, gameSettings.goldenShips);
    }

    function addUser(usersList, nickname) {
        listLength = usersList.length;
        addAnotherUser = true;
        isHost = true;
        isCurrentTurn = true;

        if(listLength != 0)
        {
            isHost = false;
            isCurrentTurn = false;
            usersList.forEach(user =>
            {
                if(user.nickname == nickname)
                {
                    addAnotherUser = false;
                }
            });    
        }
        if(addAnotherUser)
        {
            var object1 = {
                playerId: listLength,
                isHost: isHost,
                nickname: nickname,
                points: 0,
                currentTurn: isCurrentTurn,
                skippedTurn: 0,
                extraTurn: 0
            }
            
            return object1;
        }
        else
        {
            return 1;
        }
    }

    function updateGame(tilesList, clickedTile, usersList, currentUser, isGameOver, currentShipsCount, tempGameSettings) {
        return new Promise(function (resolve,reject){
        this.tilesList = tilesList;
        gameSettings = tempGameSettings;
        tempIsGameOver =  isGameOver;
        tempCurrentShipsCount = currentShipsCount;
        earnedPoints = 0;
        controlIfShipDestroyed(clickedTile);
            if(clickedTile.tileType == tileTypes.mermaid)
            {
                currentUser.extraTurn = currentUser.extraTurn + 1
                currentUser.currentTurn = true;
                currentUser.points = currentUser.points + earnedPoints
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;
            }
            if(clickedTile.tileType == tileTypes.pirate)
            {
                if(currentUser.extraTurn > 0)
                {
                    currentUser.extraTurn = currentUser.extraTurn - 1;
                }
                else
                {
                    currentUser.currentTurn = false;
                }
                earnedPoints = -1;
                currentUser.points = currentUser.points + earnedPoints
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;
            }
             if(clickedTile.tileType == tileTypes.kraken)
            {

                currentUser.extraTurn = 0;
                currentUser.currentTurn = false;
                currentUser.skippedTurn = 2;
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;
            }
            if(clickedTile.tileType == tileTypes.ship || clickedTile.tileType == tileTypes.goldenShip)
            {
                if(clickedTile.tileType == tileTypes.ship )
                {
                    earnedPoints = 1;
                    currentUser.currentTurn = true
                }
                if(clickedTile.tileType == tileTypes.goldenShip)
                {
                    earnedPoints =2;
                    currentUser.currentTurn = true
                }
                currentUser.points = currentUser.points + earnedPoints
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;

            }
            if(clickedTile.tileType == tileTypes.default)
            {
                if(currentUser.extraTurn > 0)
                {
                    currentUser.extraTurn = currentUser.extraTurn - 1;
                }
                else
                {
                    currentUser.currentTurn = false;
                }
                currentUser.points = currentUser.points + earnedPoints
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;
            }

            

            var findNextUser = true;
            if(currentUser.currentTurn == false && currentUser.extraTurn == 0)
            {
                var nextPlayerId = currentUser.playerId;
                console.log("1");
                while(findNextUser)
                {
                    if (currentUser.playerId == usersList.length - 1) 
                    {
                        nextPlayerId = 0;
                    } 
                    else 
                    {
                        nextPlayerId = currentUser.playerId + 1;
                    }
                    var nextUser = usersList.find((user) => user.playerId == nextPlayerId);
                    if(nextUser.skippedTurn > 0)
                    {
                        nextUser.skippedTurn = currentUser.skippedTurn -1;
                    }
                    else
                    {
                        nextUser.currentTurn = true;
                        findNextUser = false;
                    }
                    const newUpdatedUsers =  usersList.map((user) => {
                        if (user.playerId == nextUser.playerId) {
                            return { ...nextUser };
                        }
                        return user;
                    });
                    usersList = newUpdatedUsers;
                    currentUser = nextUser;
                }
            }
            else
            {
                console.log("2")
                currentUser.currentTurn = true;
                const updatedUsers =  usersList.map((user) => {
                    if (user.playerId == currentUser.playerId) {
                        return { ...currentUser };
                    }
                    return user;
                });
                usersList = updatedUsers;
            }
           
               
            
        resolve({ tilesList: this.tilesList, usersList: usersList, currentUser: currentUser, isGameOver: tempIsGameOver, currentShipsCount: tempCurrentShipsCount});
        });
    }

    function createNewHost(usersList)
    {
        for (let i = 0; i < usersList.length; i++) {
            usersList[i].playerId = i;
            if(usersList[i].playerId == 0)
            {
                usersList[i].isHost = true;
                usersList[i].currentTurn = true;
            }
        }
        return usersList;
    }

    function converShipTypes(gameSettings)
    {
        const convertedSizes =  gameSettings.shipTypes.toString().split('').map(Number);
        gameSettings.shipTypes = convertedSizes;
        return gameSettings;
    }

    module.exports = {
        createGame,
        updateGame,
        addUser,
        createNewHost,
        getRandomInt,
        converShipTypes
    };








