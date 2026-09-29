import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import supabase from './lib/supabase-frontend'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'

import LoginPage from './pages/loginpage/login-page'
import LandingPage from './pages/LandingPage/landing-page'
import TeamsPage from './pages/TeamsPage/teams-page'
import CardsPage from './pages/CardsPage/cards-page'
import ProfilePage from './pages/ProfilePage/profile-page'


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

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<LandingPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App