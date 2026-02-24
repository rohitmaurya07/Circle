import React from 'react'
import ProfileImage from './ProfileImage'
import { Heart } from 'lucide-react'
import { timeAgo } from '../lib/timeAgo';

const Comments = ({comments}) => {
    console.log(comments[0].createdAt);
    
  return (
    <div>

        {comments?.map((comment) => (
          
          <div key={comment?.id} className="flex gap-3 group">

            {/* Avatar */}
            {/* <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-9 h-9 rounded-full object-cover"
            /> */}
            <ProfileImage user={comment?.user} className="w-9 h-9 rounded-full object-cover" />

            {/* COMMENT BODY */}
            <div className="flex-1">

              <div className="bg-white/5 px-3 py-2 rounded-2xl">
                <p className="text-sm font-semibold text-white">
                  {comment?.user?.username || "Unknown"}
                </p>

                <p className="text-sm text-white/90">
                  {comment?.text || "Nice Buddy"}
                </p>
              </div>

              {/* META */}
              <div className="flex gap-4 text-xs text-white/50 mt-1 px-2">
                <span>{timeAgo(comment?.createdAt)}</span>
                <button className="hover:text-white">
                  Reply
                </button>
              </div>
            </div>

            {/* LIKE ICON */}
            <button className="opacity-0 group-hover:opacity-100 transition">
              <Heart size={16} className="text-white/70" />
            </button>
          </div>
        ))}

    
    </div>
  )
}

export default Comments