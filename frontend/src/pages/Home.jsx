import React, { useEffect } from 'react'
import SideBar from '../components/ui/SideBar'
import Story from '../components/ui/Story'
import Feed from '../components/Feed'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../redux/slices/userSlice'

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [])
  
  return (
    <div className='flex'>
      <SideBar/>
      <div className='p-4'>
      <Story/>
      <Feed/>
      </div>
    </div>
  )
}

export default Home