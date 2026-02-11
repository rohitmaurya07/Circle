import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './redux/slices/userSlice'
const App = () => {
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   dispatch(getCurrentUser())
  // }, [dispatch])
  
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
    </Routes>
    
    </>
  )
}

export default App