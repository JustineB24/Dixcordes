const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Toujours cibler backend/db quel que soit le dossier de lancement
const dbDir = path.resolve(__dirname, '../db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: (msg) => console.log(`[SQLITE] ${msg}`)
});

const Chat = require('../models/chat')(sequelize);

module.exports = {
    sequelize,
    Chat
};