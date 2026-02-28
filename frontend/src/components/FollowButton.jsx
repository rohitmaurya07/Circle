import React from 'react'

const FollowButton = ({post}) => {
    console.log("Data",post);
    
  return (
    <button className='bg-content text-white px-4 py-2 rounded-full hover:bg-blue-600 transition text-sm'>Follow</button>
  )
}

export default FollowButton