import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import RegistrationForm from './sign-in/page/sign-in'

import Home from './Home/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
