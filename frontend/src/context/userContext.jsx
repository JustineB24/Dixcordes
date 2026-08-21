import { useState, createContext, useContext, useEffect } from 'react'

const userContext = createContext()

export const UserProvider = ({ children }) => {
    const [pseudo, setPseudo] = useState(() => {
        // Vérifie si un pseudo est stocké dans le localStorage
        const storedPseudo = localStorage.getItem('pseudo');
        return storedPseudo || ''; // Retourne le pseudo stocké ou une chaîne vide par défaut
    });
    const [room, setRoom] = useState(() => {
        // Vérifie si une salle est stockée dans le localStorage
        const storedRoom = localStorage.getItem('room');
        return storedRoom || 'general'; // Retourne la salle stockée ou "general" par défaut
    });

    useEffect(() => {
        // Met à jour le localStorage lorsque le pseudo change
        localStorage.setItem('pseudo', pseudo);
    }, [pseudo]);

    useEffect(() => {
        // Met à jour le localStorage lorsque la salle change
        localStorage.setItem('room', room);
    }, [room]);

    return (
        <userContext.Provider value={{ pseudo, setPseudo, room, setRoom }}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => useContext(userContext)