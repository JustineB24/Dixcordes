const httpServer = require('http').createServer();
const { Server } = require('socket.io');
const { sequelize, chatModel } = require('./config/database');

const PORT = 3000;
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

async function startDatabaseConnection() {
    try {
        // Tester la connexion
        await sequelize.authenticate();
        console.log('Database connected');

        // Créer les tables
        await sequelize.sync();
        console.log('Database synchronized');

    } catch (error) {
        console.error('Database error:', error);
    }
}

startDatabaseConnection();

let connectedUsers = new Map();
connectedUsers.set('general', []);
connectedUsers.set('tech', []);
connectedUsers.set('loisirs', []);
connectedUsers.set('musiques', []);
connectedUsers.set('films', []);

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`)

    // Rejoindre un salon
    socket.on('joinRoom', (data) => {
        const { room, pseudo } = data;

        // Quitter tous les salons précédemment rejoints
        socket.rooms.forEach((joinedRoom) => {
            if (joinedRoom !== socket.id) {
                socket.leave(joinedRoom);

                // Mettre à jour la liste des utilisateurs connectés dans le salon quitté
                if (connectedUsers.has(joinedRoom)) {
                    const updatedUsers = connectedUsers.get(joinedRoom).filter(user => user.id !== socket.id);
                    connectedUsers.set(joinedRoom, updatedUsers);

                    // Notifier les autres utilisateurs du salon quitté de la mise à jour de la liste des utilisateurs connectés
                    io.to(joinedRoom).emit('onlineUsers', updatedUsers);
                }
            }
            console.log(`Client ${socket.id} left room: ${joinedRoom}`);
        });

        // Rejoindre le nouveau salonZ
        socket.join(room);

        // Ajouter l'utilisateur à la liste des utilisateurs connectés dans le salon
        if (!connectedUsers.has(room)) {
            connectedUsers.set(room, []);
        }

        connectedUsers.get(room).push({
            id: socket.id,
            pseudo: pseudo
        });

        console.log(`Connected users in room ${room}:`, connectedUsers.get(room));

        // Récupérer l'historique des messages du salon depuis la base de données et l'envoyer au client
        io.to(room).emit('onlineUsers', connectedUsers.get(room));

        chatModel.findAll({
            where: { room },
            order: [['createdAt', 'ASC']]
        })
            .then(messages => {
                socket.emit('chatHistory', messages);
                console.log(`Sent chat history to client ${socket.id} for room: ${room}`);
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
            });

        console.log(`Client ${socket.id} joined room: ${room}`);
    });

    // Quitter un salon
    socket.on('leaveRoom', (data) => {
        const room = data.room;
        socket.leave(room);

        // Supprimer l'utilisateur de la liste des utilisateurs connectés dans le salon
        if (connectedUsers.has(room)) {
            const updatedUsers = connectedUsers.get(room).filter(user => user.id !== socket.id);
            connectedUsers.set(room, updatedUsers);

            // Prévenir les autres utilisateurs du salon de la mise à jour de la liste des utilisateurs connectés
            io.to(room).emit('onlineUsers', updatedUsers);
        }

        console.log(`Connected users in room ${room}:`, connectedUsers.get(room));
    });

    // Envoi et réception des messages de chat
    socket.on('chatMessage', (data) => {
        const createdAt = new Date().toISOString();
        const messageData = {
            pseudo: data.pseudo,
            message: data.message,
            room: data.room,
            createdAt
        };

        // Diffuser immédiatement le message à tous les clients connectés dans le salon
        io.to(data.room).emit('chatMessage', messageData);

        // Sauvegarder le message dans la base de données
        chatModel.create({
            pseudo: messageData.pseudo,
            message: messageData.message,
            room: messageData.room,
            createdAt: messageData.createdAt
        })
            .then(() => {
                console.log(`Message saved to database: ${messageData.message}`);
            })
            .catch((error) => {
                console.error('Error saving message to database:', error);
            });

        console.log(`Message from ${data.pseudo} in room ${data.room}: ${data.message}`);
    });

    // Déconnexion d'un utilisateur
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);

        // Nettoyer la liste des utilisateurs connectés dans tous les salons
        connectedUsers.forEach((users, room) => {
            const updatedUsers = users.filter(user => user.id !== socket.id);
            connectedUsers.set(room, updatedUsers);

            // Prévenir les autres utilisateurs du salon de la mise à jour de la liste des utilisateurs connectés
            io.to(room).emit('onlineUsers', updatedUsers);
        });
    });
});

const server = httpServer.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });