import { useState } from 'react'
import './App.css'
import LoginPage from './components/loginpage/loginpage'
import { useEffect } from 'react'
import supabase from './supabase-frontend'

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
    <>
      <LoginPage />
    </>
  )
}

export default App
