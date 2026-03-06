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
  <GoogleOAuthProvider clientId="178543182928-k4duvta253j8fuv8tudfvrdi2e6oog8t.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </BrowserRouter>,
 </StrictMode>
)
