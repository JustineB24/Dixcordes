import { io } from 'socket.io-client';

// Instance unique réutilisable dans toute l'application
export const socket = io('http://localhost:3000', {
    autoConnect: true,
    transports: ['websocket', 'polling']
});