import { useState } from 'react'
import './App.css'
import TestFunc from './components/test'
import LoginForm from './components/forms/login-form'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginForm />
    </>
  )
}

export default App
