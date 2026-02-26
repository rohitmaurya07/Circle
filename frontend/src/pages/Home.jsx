import React from 'react'
import SideBar from '../components/ui/SideBar'
import Story from '../components/ui/Story'
import Feed from '../components/Feed'

const Home = () => {
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