import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { UserProvider } from './context/userContext.jsx'
import './styles/theme.css'

createRoot(document.getElementById('root')).render(
    <UserProvider>
        <App />
    </UserProvider>
)