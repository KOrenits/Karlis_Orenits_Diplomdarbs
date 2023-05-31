const { Sequelize, Model} = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../database/foggySeaDatabase.sqlite',
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
    console.error('Database synchronized succesfully');
  })
  
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

function getGameSettingsById(id) {
  return GameSettings.findByPk(id)
    .then((gameSettings) => {
      if (gameSettings) {
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
  getGameSettingsById,
  getGameSettingsCount
};






