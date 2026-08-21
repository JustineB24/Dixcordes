import { React, useEffect, useState } from 'react'
import { useUser } from '../context/userContext.jsx'
import RoomCard from '../components/roomCard'

const Login = () => {
    useEffect(() => { document.title = "Dixcordes, c'est dans vos cordes"; }, []);
    const { pseudo, setPseudo, room, setRoom } = useUser();

    return (
        <main className="w-3/5 flex flex-col items-center justify-center gap-5 bg-[var(--color-background)] border border-[var(--color-on-surface)] rounded-lg p-10 shadow-lg">
            <img src="/src/assets/logo_dixcordes.png" alt="Logo Dixcordes" className="w-50 h-50" />
            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="font-label-xs text-label-xs text-text-dimmed uppercase tracking-wider" htmlFor="pseudoInput">Pseudo:</label>
                    <input 
                        className="w-full bg-surface-elevated border border-surface-border rounded focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body-sm text-body-sm p-2.5 transition-colors placeholder:text-surface-border focus:outline-none" 
                        id="pseudoInput" 
                        placeholder="Entrez votre pseudo" 
                        required 
                        type="text"
                    />
                </div>
                <ul className="flex flex-wrap flex-row gap-2 w-full">
                    <RoomCard roomName="Général" onClick={() => setRoom('general')} active={room == 'general'} />
                    <RoomCard roomName="Tech" onClick={() => setRoom('tech')} active={room == 'tech'} />
                    <RoomCard roomName="Loisirs" onClick={() => setRoom('loisirs')} active={room == 'loisirs'} />
                    <RoomCard roomName="Musiques" onClick={() => setRoom('musiques')} active={room == 'musiques'} />
                    <RoomCard roomName="Films" onClick={() => setRoom('films')} active={room == 'films'} />
                </ul>

                <button 
                    className="w-full bg-[var(--color-on-primary)] font-label-sm text-label-sm text-on-primary rounded p-2.5 transition-colors hover:bg-[var(--color-inverse-primary)]" 
                    type="submit"
                    onClick={() => { setPseudo(document.getElementById('pseudoInput').value) }}
                >
                        Se connecter
                </button>
            </form>
        </main>
    )
}

export default Login