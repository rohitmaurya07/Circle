import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react'
import React from 'react'
import LikeButton from './LikeButton';

const MediaIcons = ({post}) => {
    console.log("icons",post);
    
  return (
    <div>
        <div className="flex justify-between items-center px-4 py-3">
        <div className="flex gap-4">
          <Heart className="cursor-pointer hover:scale-110 transition" />
          <MessageCircle className="cursor-pointer hover:scale-110 transition" />
          <Send className="cursor-pointer hover:scale-110 transition" />
        </div>
        <Bookmark className="cursor-pointer hover:scale-110 transition" />
      </div>

      <LikeButton post={post} />

      {/* Date */}
      <p className="px-4 pb-4 text-xs text-gray-400 uppercase tracking-wide">
        {post?.createdAt}
      </p>
    </div>
  )
}

export default MediaIcons