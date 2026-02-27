import React from 'react'

const LikeButton = ({post}) => {
  return (
    <div>
        {/* Likes */}
      <p className="px-4 font-semibold text-sm">{post?.likes?.length.toLocaleString()} likes</p>
      <p className="px-4 py-2 text-sm">
        <span className="font-semibold mr-2">{post?.user?.username}</span>
        {post?.caption}
      </p>
    </div>
  )
}

export default LikeButton