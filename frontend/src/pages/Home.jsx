import React from 'react'
import SideBar from '../components/ui/SideBar'
import Story from '../components/ui/Story'
import Feed from '../components/Feed'
import SuggestedUsers from '../components/SuggestedUsers'

const Home = () => {
  
  return (
    <div className='flex bg-black text-white'>
      <SideBar/>
      <div className='p-4'>
      <Story/>
      <Feed/>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default Home