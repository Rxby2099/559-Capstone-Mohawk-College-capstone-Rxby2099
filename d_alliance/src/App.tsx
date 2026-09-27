import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import supabase from './supabase-frontend'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LoginPage from './components/loginpage/login-page'
import LandingPage from './components/LandingPage/landing-page'
import TeamsPage from './components/TeamsPage/teams-page'
import CardsPage from './components/CardsPage/cards-page'
import ProfilePage from './components/ProfilePage/profile-page'

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
  )
}

export default App