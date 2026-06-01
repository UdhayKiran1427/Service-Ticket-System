import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import SignIn from './pages/SignIn'
import Login from './pages/Login'
import { Routes, Route } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0)

  return (
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignIn />} />


        
      </Routes>
    
  )
}

export default App
