import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './App.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider from './context.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const clientId= import.meta.env.VITE_CLIENTID
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
            <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
