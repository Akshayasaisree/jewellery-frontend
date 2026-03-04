import { StrictMode } from 'react'
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <GoogleOAuthProvider clientId="564453147944-fco1mb1nkmvnnm1o9l5djc1d9s6grplh.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>,
 </StrictMode>
)
