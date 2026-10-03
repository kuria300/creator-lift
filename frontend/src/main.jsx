import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './context/context.jsx'
import { Toaster } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';

const clientId= import.meta.env.VITE_CLIENTID
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Toaster position="top-right" richColors />
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
            <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
