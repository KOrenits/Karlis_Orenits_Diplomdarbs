
  const { Sequelize, Model} = require('sequelize');
// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/foggySeaDatabase.sqlite', // Specify the path where you want to create the SQLite database file
});

class Stats extends Model {}
Stats.init({
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  totalGamesPlayed: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalGamesWon: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalTilesDestroyed:{
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  totalPointsEarned:{
    type: Sequelize.INTEGER,
    allowNull: true,
  }
}, { sequelize, modelName: 'stats' });

class Player extends Model {}
Player.init({
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nickName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gameId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}, { sequelize, modelName: 'player' });

class GameSettings extends Model {}
GameSettings.init({
  id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shipTypes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  gameColumns: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  gameRows: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  goldenShips: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  krakens: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  mermaids: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  pirates: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
}, { sequelize, modelName: 'gameSettings' });

sequelize.sync()
  .then(async () => {
    console.error('Databse synchronized succesfully');

   /*  const shipTypes = '654332211';
    const gameColumns = 12;
    const gameRows = 12;
    const goldenShips = 8;
    const krakens = 20;
    const mermaids = 20;
    const pirates = 10;

    GameSettings.create({
      shipTypes: shipTypes,
      gameColumns: gameColumns,
      gameRows: gameRows,
      goldenShips: goldenShips,
      krakens: krakens,
      mermaids: mermaids,
      pirates: pirates
    }); */

  /* GameSettings.findByPk(6)
  .then((gameSettings) => {
    if (gameSettings) {

      // Update the shipTypes value
      gameSettings.shipTypes = '999999';

      // Save the updated gameSettings
      gameSettings.save();
    } else {
      console.log('GameSettings not found.');
    }
  }) */
   /*   
    GameSettings.findAll()
    .then((gameSettings) => {
      console.log('All GameSettings:');
      gameSettings.forEach((setting) => {
        console.log('ID:', setting.id);
        console.log('Ship Types:', setting.shipTypes);
        console.log('Golden Ships:', setting.goldenShips);
        console.log('Columns:', setting.gameColumns);
        console.log('Rows:', setting.gameRows);
        console.log('Krakens:', setting.krakens);
        console.log('Mermaids:', setting.mermaids);
        console.log('Pirates:', setting.pirates);
        console.log('---');
      });
    }) */
    // Process the retrieved game settings data as needed
  })
  
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

/*   const gameSettings = {
    shipTypes: [
        6,5,4,3,3,2,2,2,1,1,1,1
    ],
    columns: 12,
    rows: 12,
    goldenShips: 3,
    krakens: 12,
    mermaids: 6,
    pirates: 6
} */

function getGameSettingsById(id) {
  return GameSettings.findByPk(id)
    .then((gameSettings) => {
      if (gameSettings) {
/*         console.log('GameSettings found:');
        console.log('ID:', gameSettings.id);
        console.log('Ship Types:', gameSettings.shipTypes);
        console.log('Golden Ships:', gameSettings.goldenShips);
        console.log('Columns:', gameSettings.gameColumns);
        console.log('Rows:', gameSettings.gameRows);
        console.log('Krakens:', gameSettings.krakens);
        console.log('Mermaids:', gameSettings.mermaids);
        console.log('Pirates:', gameSettings.pirates); */
        return gameSettings.dataValues;
      }
     
    })
    .catch((error) => {
      console.error('Error retrieving game settings:', error);
      throw error;
    });
}

function getGameSettingsCount() {
  return GameSettings.count()
    .then((count) => {
      console.log(`GameSettings count: ${count}`);
      return count;
    })
    .catch((error) => {
      console.error('Error retrieving gameSettings count:', error);
      throw error;
    });
}

module.exports = {
  //createDatabase,
  //createGameSettings,
  getGameSettingsById,
  getGameSettingsCount
};






