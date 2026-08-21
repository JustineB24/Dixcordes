const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// 1. S'assurer que le dossier backend/db existe
const dbDir = path.resolve(__dirname, '../db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'database.sqlite');

// 2. Initialiser SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: (msg) => console.log(`[SQLITE] ${msg}`)
});

// 3. Charger le modèle avec sequelize et DataTypes
const chatModel = require('../models/chat')(sequelize, DataTypes);

// 4. Tester la connexion et créer la table
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('✅ Database synchronized (table chats prête)');
    })
    .catch((err) => {
        console.error('❌ Database error:', err);
    });

// 5. Exporter avec le nom attendu par server.js
module.exports = {
    sequelize,
    chatModel
};