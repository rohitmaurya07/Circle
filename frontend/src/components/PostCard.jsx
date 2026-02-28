import React, { useState } from 'react'
import MediaIcons from './MediaIcons'
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';

const PostCard = ({post}) => {
  console.log(post);
  // console.log(post?._id);
  // console.log(post?.user?.username);
  
  return (
    <div className='bg-gray-200 rounded-2xl m-5 p-5'>
      <div className=' w-[400px]'>

        {/* Header */}
        <div className='flex gap-2 justify-between  bg-gray-300 text-black rounded-3xl px-2 py-2'>
            <div className='flex gap-2'>
              <ProfileImage user={post?.user} className="w-9 h-9 rounded-full object-cover" />
              <p>{post?.user?.username}</p>
            </div>
            <FollowButton />
        </div>

        {/* Media */}
        <div className='aspect-square bg-content rounded-3xl mt-2 '>
          {
            post?.mediaType === "image" ? (
              <img src={post?.mediaUrl} alt="post" className='h-full m-auto  ' />
            ) : (
              <video 
                  src={post?.mediaUrl} 
                  alt="post" 
                  controls
                  muted
                  autoPlay
                  loop
                  className='h-full m-auto  ' />
            )
          }
        </div>

        {/* Icons */}
        <div>
          <MediaIcons />
        </div>
      </div>
      Post
    </div>
  )
}

export default PostCard