import { useState } from 'react'
import './App.css'
import TestFunc from './components/test'
import LoginForm from './components/forms/login-form'
import RegistrationForm from './components/forms/registration-page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegistrationForm />
    </>
  )
}

export default App
