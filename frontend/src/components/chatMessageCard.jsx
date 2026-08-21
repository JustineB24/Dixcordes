import React from "react";

const ChatMessage = ({ time, user, message, isOwnMessage }) => {
    return (
        <div className={`flex flex-col w-full p-2 rounded-lg mb-2 ${isOwnMessage ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]' : 'bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]'}`}>
            <p className="text-lg">{time} - {user}</p>
            <p>{message}</p>
        </div>
    );
}

export default ChatMessage;