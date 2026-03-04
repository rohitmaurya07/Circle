import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import EditProfile from './components/EditProfile'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from './redux/slices/userSlice'

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // console.log("App.jsx user",user);
  
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [])
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/profile/:id' element={<Profile/>} />
      <Route path='/explore' element={<Explore/>} />
      <Route path='/edit-profile' element={<EditProfile/>} />
    </Routes>
    
    </>
  )
}

export default App