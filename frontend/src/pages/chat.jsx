import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useUser } from "../context/userContext.jsx";
import logo from "../assets/logo_dixcordes.png";
import ChatMessage from "../components/chatMessageCard";

// Socket gestion
const socket = io('http://localhost:3000', {
    transports: ['websocket']
});

function Chat() {
    const { pseudo, setPseudo, room, setRoom } = useUser();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState(""); const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!pseudo || !room) return;

        // Rejoindre le salon
        socket.emit('joinRoom', { room, pseudo });

        // Écouter l'historique des messages
        const handleChatHistory = (history) => {
            setMessages(history || []);
        };

        // Écouter la liste des utilisateurs connectés
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users || []);
        };

        // Écouter les nouveaux messages
        const handleChatMessage = (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.on('chatHistory', handleChatHistory);
        socket.on('onlineUsers', handleOnlineUsers);
        socket.on('chatMessage', handleChatMessage);

        // Nettoyage lors du changement de salon ou démontage
        return () => {
            socket.emit('leaveRoom', { room, pseudo });
            socket.off('chatHistory', handleChatHistory);
            socket.off('onlineUsers', handleOnlineUsers);
            socket.off('chatMessage', handleChatMessage);
        };
    }, [room, pseudo]);

    const handleSendMessage = () => {
        const text = inputMessage.trim();
        if (!text) return;

        socket.emit('chatMessage', {
            pseudo: pseudo,
            room: room,
            message: text
        });

        setInputMessage("");

        // Remet la hauteur par défaut
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.style.height = 'auto';
    };

    // Liste des salons
    const channels = [
        { id: "general", name: "Général", icon: "💬" },
        { id: "tech", name: "Tech", icon: "👨‍💻" },
        { id: "loisirs", name: "Loisirs", icon: "🏀" },
        { id: "musiques", name: "Musiques", icon: "🎵" },
        { id: "films", name: "Films", icon: "🎥" },
    ];

    // Salon actif sélectionné
    const currentChannel = channels.find((channel) => channel.id === room);

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-surface text-on-surface antialiased">
            {/* Colonne Gauche: Salons */}
            <aside className="hidden md:flex w-64 h-full flex-col border-r border-surface-border fixed left-0 top-0 bottom-0 z-40">

                {/* En-tête / Logo */}
                <div className="h-16 px-4 border-b border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="Dixcordes Logo"
                            className="w-50 h-50 rounded-md object-contain"
                        />
                    </div>
                </div>

                {/* Liste des salons textuels */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-text-dimmed uppercase tracking-wider">
                        Salons textuels
                    </div>

                    {/* Boutons des salons */}
                    {channels.map((channel) => {
                        const isActive = room === channel.id;
                        return (
                            <button
                                key={channel.id}
                                onClick={() => {
                                    setMessages([]);
                                    setRoom(channel.id);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${isActive
                                    ? "bg-surface-elevated text-primary shadow-sm border border-surface-border"
                                    : "text-text-dimmed hover:text-on-surface hover:bg-surface-elevated/50"
                                    }`}
                            >
                                <span className="text-lg">{channel.icon}</span>
                                <span className="flex-1 text-left">{channel.name}</span>
                                {isActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Profil utilisateur connecté */}
                <div className="p-3 border-t border-surface-border bg-surface-container-low/50">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated/60 border border-surface-border/50">
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-on-surface truncate">{pseudo}</span>
                            <span className="text-xs text-status-online flex items-center gap-1 ">
                                En ligne
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Colonne Centrale: Chat */}
            <main className="flex-1 flex flex-col h-full md:ml-64 lg:mr-60 relative">

                {/* En-tête du salon actif */}
                <header className="h-16 border-b border-surface-border flex items-center justify-between px-6 shrink-0 bg-surface-main/95 backdrop-blur-sm z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">{currentChannel?.icon}</span>
                        <h1 className="font-headline-md text-headline-md text-on-surface">
                            {currentChannel?.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-text-dimmed">
                        {/* Bouton membres pour mobile */}
                        <button className="hover:text-on-surface transition-colors lg:hidden">
                            <span className="material-symbols-outlined">👤</span>
                        </button>
                    </div>
                </header>

                {/* Zone de défilement des messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            time={msg.createdAt}
                            user={msg.pseudo}
                            message={msg.message}
                            isOwnMessage={msg.pseudo === pseudo}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Barre de saisie de message */}
                <div className="p-4 bg-surface-main border-t border-surface-border shrink-0">
                    <div className="relative flex items-end gap-3 max-w-4xl mx-auto w-full">

                        {/* Zone de texte */}
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md resize-none py-3 px-4 max-h-32 min-h-[44px] outline-none"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Votre message..."
                            rows={1}
                        />

                        {/* Bouton d'envoi */}
                        <button
                            type="button"
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-150 flex-shrink-0 font-semibold cursor-pointer"
                            onClick={handleSendMessage}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </main>

            {/* Colonne Droite: Membres */}
            <aside className="hidden lg:flex w-60 h-full flex-col bg-surface-container-low border-l border-surface-border fixed right-0 top-0 bottom-0 z-30">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-teal-400 uppercase tracking-widest">Membres</h3>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <section className="mb-6">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-3">
                            En Ligne - {onlineUsers.length}
                        </p>

                        {onlineUsers.map((user) => (
                            <div
                                key={user.id || user.pseudo}
                                className="px-4 py-2 flex items-center gap-3 hover:bg-surface-elevated/40 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
                                        {user.pseudo?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-surface-container-low rounded-full" />
                                </div>
                                <span className={`text-sm font-medium ${user.pseudo === pseudo ? "text-primary font-semibold" : "text-on-surface"}`}>
                                    {user.pseudo} {user.pseudo === pseudo && "(moi)"}
                                </span>
                            </div>
                        ))}
                    </section>
                </div>
            </aside>
        </div >
    )
}

export default Chat;