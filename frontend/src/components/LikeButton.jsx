import { Heart } from 'lucide-react'
import React from 'react'

const LikeButton = ({post}) => {
  return (
    <div className=' flex flex-col '>
      <Heart className="cursor-pointer hover:scale-110 transition" />
      {/* Likes */}
      <p className=" font-semibold text-sm">{post?.likes?.length.toLocaleString() || "0"} likes</p>
      {/* <p className=" text-sm">
        <span className="font-semibold mr-2">{post?.user?.username}</span>
        {post?.caption}
      </p> */}
    </div>
  )
}

export default LikeButton