// External imports
import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import supabase from './lib/supabase-frontend'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import SessionRouteLock from './components/RouteLocks/SessionRouteLock'
import SessionlessRouteLock from './components/RouteLocks/SessionlessLock'
import "@fontsource/liter";
import "@fontsource/liter/400.css";

// Imported pages
import LoginPage from './pages/loginpage/login-page'
import LandingPage from './pages/LandingPage/landing-page'
import TeamsPage from './pages/TeamsPage/teams-page'
import CardsPage from './pages/CardsPage/cards-page'
import ProfilePage from './pages/ProfilePage/profile-page'
import CharacterPage from './pages/CharacterPage/character-page'
function App() {

  return (
    
    <AuthProvider>
      <BrowserRouter>
        <Routes>

            <Route path="/" element={
              <SessionlessRouteLock><Navigate to="/login" /></SessionlessRouteLock>
            }  />

            <Route path="/login" element={
              <SessionlessRouteLock><LoginPage/></SessionlessRouteLock>
            } />

            <Route path="/dashboard" element={
              <SessionRouteLock><LandingPage/></SessionRouteLock>
            } />

            <Route path="/teams" element={
              <SessionRouteLock><TeamsPage/></SessionRouteLock>
            } />

            <Route path="/cards" element={
              <SessionRouteLock><CardsPage/></SessionRouteLock>
            }/>

            <Route path="/profile" element={
              <SessionRouteLock><ProfilePage/></SessionRouteLock>
            }/>

            <Route path = "/characters/:id" element={
              <SessionRouteLock><CharacterPage/></SessionRouteLock>
            }/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

export default App