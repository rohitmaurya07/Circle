import React, { useEffect } from 'react'
import ProfileImage from './ProfileImage'
import { Heart } from 'lucide-react'
import { timeAgo } from '../lib/timeAgo';

const Comments = ({comments}) => {   
  
  
  return (
    <div className='p-2'>

        {comments?.map((comment) => (
          
          <div key={comment?.id} className="flex gap-3 group bg-gray-200 m-1 p-2 rounded-2xl">

            {/* Avatar */}
            {/* <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="w-9 h-9 rounded-full object-cover"
            /> */}
            <ProfileImage user={comment?.user} className="w-9 h-9 ml-5 rounded-full object-cover" />

            {/* COMMENT BODY */}
            <div className="flex-1">

              <div className="bg-white/5 px-3 py-2 rounded-2xl">
                <p className="text-sm font-semibold">
                  {comment?.user?.username || "Unknown"}
                </p>

                <p className="text-sm ">
                  {comment?.text || "Nice Buddy"}
                </p>
              </div>

              {/* META */}
              <div className="flex gap-4 text-xs  mt-1 px-2">
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