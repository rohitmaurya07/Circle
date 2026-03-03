import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Explore from './pages/Explore'

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/profile/:id' element={<Profile/>} />
      <Route path='/explore' element={<Explore/>} />
    </Routes>
    
    </>
  )
}

export default App