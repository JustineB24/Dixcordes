

import { useUser } from "../context/userContext.jsx";
const { pseudo, setPseudo, room, setRoom } = useUser();

export const connectToServer = () => {
    const socket = io('http://192.168.1.197:3000', {
        transports: ['websocket']
    });

    socket.on('connect', () => {
        console.log(`Connected to server with ID: ${socket.id}`);
        socket.emit('joinRoom', { room });
    });

    socket.on('chatHistory', (messages) => {
        console.log('Received chat history:', messages);
        // Handle displaying chat history in the UI
    });

    socket.on('chatMessage', (data) => {
        console.log('Received new message:', data);
        // Handle displaying new message in the UI
    });

    return socket;
};

/*if (!room) {
    room = "general";
    localStorage.setItem("currentRoom", currentRoom);
} else {
    switchRoom(currentRoom);
}

socketClient.on('connect', () => {
    console.log(`Connected to server with ID: ${socketClient.id}`);

    socketClient.emit('joinRoom', { room: currentRoom });

    socketClient.on('chatHistory', (messages) => {
        messages.forEach(msg => {
            displayMessage(msg.username, msg.message, msg.createdAt);
        });
    });

    socketClient.on('chatMessage', (data) => {
        displayMessage(data.username, data.message, data.createdAt);
    });
});

bindRoomButtons((newRoom, previousRoom) => {
    if (previousRoom) {
        socketClient.emit('leaveRoom', { room: previousRoom });
    }
    localStorage.setItem("currentRoom", newRoom);
    currentRoom = newRoom;
    socketClient.emit('joinRoom', { room: newRoom });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const messageData = getMessageData();
    if (messageData.message) {
        socketClient.emit('chatMessage', messageData);
        messageInput.value = "";
    }
});*/