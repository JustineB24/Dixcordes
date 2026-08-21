import { useState, useEffect } from 'react'
import { useUser } from './context/userContext.jsx'

// pages
import Login from './pages/login'
import Chat from './pages/chat'

function App() {
  const { pseudo, room } = useUser();

  return (
    <div className="bg-gradient-to-br from-[var(--color-surface-container-low)] to-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] h-screen w-screen flex flex-col items-center justify-center">
        {pseudo && room !== '' ? <Chat /> : <Login/>}
    </div>
  )
}

export default App
