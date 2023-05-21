
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

const gameSettings = {
    shipTypes: [
        6,5,4,3,3,2,2,2,1,1,1,1
    ],
    columns: 12,
    rows: 12,
    goldenShips: 3,
    krakens: 12,
    mermaids: 6,
    pirates: 6
}

var shipsCount = gameSettings.shipTypes.length;

var shipsList = []
var tilesList = []


var tempTileList = []
var tempShip = []
var earnedPoints;

function createGame() {
    return new Promise(function (resolve,reject){
        shipsList = [];
        tempTileList = [];
        tempShip = [];
        tilesList = [];

        for (var y = 0; y < gameSettings.rows; y++)
        {
            var columns = [];
            for(var x = 0; x < gameSettings.columns; x++)
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
            tilesList.push(columns)
        }
        
        createShips();
        createGoldenShips();
        createKrakens();
        createMermaids();
        createPirates(); 
        resolve(tilesList);
    });
}

function updateGame(tilesList, clickedTile, usersList, currentUser) {
    return new Promise(function (resolve,reject){
    this.tilesList = tilesList;
    controlIfShipDestroyed(tilesList, clickedTile);

    if (earnedPoints > 0) 
    {
        //console.log(earnedPoints);
        currentUser.points = currentUser.points + earnedPoints;
        //console.log(currentUser);
        //console.log(usersList);
        const updatedUsers =  usersList.map((user) => {
            if (user.playerId == currentUser.playerId) {
                return { ...currentUser };
            }
            return user;
        });
        usersList = updatedUsers;
        earnedPoints = 0;
    } 
    else 
    {
        currentUser.currentTurn = false;
        const updatedUsers =  usersList.map((user) => {
            if (user.playerId == currentUser.playerId) {
                return { ...currentUser };
            }
            return user;
        });
        usersList = updatedUsers;
        var nextPlayerId = currentUser.playerId;
        if (nextPlayerId == usersList.length - 1) 
        {
            nextPlayerId = 0;
        } 
        else 
        {
            nextPlayerId = currentUser.playerId + 1;
        }
        var nextUser = usersList.find((user) => user.playerId == nextPlayerId);
        nextUser.currentTurn = true;
        const newUpdatedUsers =  usersList.map((user) => {
            if (user.playerId == nextUser.playerId) {
                return { ...nextUser };
            }
            return user;
        });
        usersList = newUpdatedUsers;
        currentUser = nextUser;
    }


    resolve({ tilesList: tilesList, usersList: usersList, currentUser: currentUser });
    });
}

function mapUsers(usersList, currentUser)
{
    
    //console.log("4");
    //console.log(currentUser);
        //console.log(usersList);
}

function controlIfShipDestroyed(tilesList, clickedTile){
    var currentShip = [];
    var currentTile = [];
    tilesList.forEach(ship =>{
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
            shipsCount = shipsCount - 1;
        }
    } 
                
    if (shipsCount == 0)
        fillRestOfRemainingTiles();
}


function  fillRestOfRemainingTiles(){
    for (var y = 0; y < gameSettings.rows; ++y)
    {
        for (var x = 0; x < gameSettings.columns; ++x)
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
            var x = getRandomInt(gameSettings.rows);
            var y = getRandomInt(gameSettings.columns);
            tempTileList = [];
            tempShip = [];
            if(tilesList[y][x].canPutShip == true)
            {
                tilesList[y][x].tileType = tileTypes.ship;
                tilesList[y][x].canPutShip = false;
                tempShip.push(tilesList[y][x]);
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
                if (tilesList[yMin][xMin].tileType == tileTypes.default && tilesList[yMin][xMin].canPutShip && tilesList[yMin][xMin].isPossibleShipTile)
                {
                tilesList[yMin][xMin].isPossibleShipTile = false;
                tempTileList.push(tilesList[yMin][xMin]);
                }
            }
            else
            {
                //Find Ship Border Tiles
                if (tilesList[yMin][xMin].tileType != tileTypes.ship)
                {
                    if (methodType == 1)
                        tilesList[yMin][xMin].canPutShip = false;
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
    if (x >= 0 && x < gameSettings.rows && y >= 0 && y < gameSettings.columns)
        return true;

    return false;
    }
    
function  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
    }

function  createSpecialTiles(validationTileType, tileType, count){
    tempTileList = [];
    for (var y = 0; y < gameSettings.rows; ++y)
    {
        for (var x = 0; x < gameSettings.columns; ++x)
        {
        if (tilesList[y][x].tileType == validationTileType)
            tempTileList.push(tilesList[y][x]);
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

    function addUser(usersList, nickname, gameId) {
        listLength = usersList.length;
        addAnotherUser = true;
        isHost = true;
        isCurrentTurn = true;

        if(listLength != 0)
        {
            isHost = false;
            isCurrentTurn = false;
            console.log("2");
            usersList.forEach(user =>
            {
                console.log("1");
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
                gameId: gameId,
                points: 0,
                currentTurn: isCurrentTurn,
                skippedTurn: false
            }
            
            return object1;
        }
        else
        {
            return 1;
        }
    }

    module.exports = {
        createGame,
        updateGame,
        addUser
    };


    /* function  controlIfShipDestroyed(createdTilesList, clickedTile){
        var index = 0;
        createdTilesList.forEach(ship =>{
        ship.forEach(tiles =>{
            if (tiles == clickedTile)
            {
            var shipIsDestroyed = true;
            tempShip = ship;
            tempShip.forEach(tile =>{
                if (!tile.selected )
                {
                    shipIsDestroyed = false;
                }
            });
            if (shipIsDestroyed)
            {
                findNecessaryShipBorderOrExpansionTiles(tempShip, 2);
                shipsList.splice(index, 1);
            }
            }
        });
        index++;
        });
        if (shipsList.length == 0)
            fillRestOfRemainingTiles();
    } */


// function createGame() {
//     return new Promise(function (resolve, reject) {
//        var cardIndex = [] 
//         var cards = []
//         var cardsfinal = [];
//         var singleIndex;
//         for (var i = 0; i < 100; i++) {

//             singleIndex = getRandomInt(tileTypes.length);
//             cardIndex.push(i)
//             cards.push(
//                 {
//                     word: " ",
//                     color: "blue",
//                     tileType: tileTypes[1],
//                     selected: false
//                 })
//         }

//         for (var red = 0; red < 25; red++) {
//             var singleIndex = getRandomInt(cards.length)

//             cards[singleIndex].color = "red";
//             cards[singleIndex].tileType = tileTypes[0];
//             cardsfinal.push(cards[singleIndex]);
//             cards.splice(singleIndex, 1);
//         }

//         var final = cards.concat(cardsfinal);
//         final = shuffle(final);

//         resolve(final);
//     });
// }


// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;

//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {

//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// }

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

// module.exports = {
//     createGame
// };










