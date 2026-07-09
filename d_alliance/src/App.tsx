import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import supabase from './supabase-frontend'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from './components/loginpage/login-page'
import LandingPage from './components/LandingPage/landing-page'

function App() {

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if(event === 'SIGNED_IN'){
        console.log('User logged in: ', session);
      }
      else if(event === 'SIGNED_OUT'){
        console.log('User logged out');
      }
    });
  }, []);

  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<LandingPage />} />
            

        </Routes>
    </BrowserRouter>
  )
}

export default App
