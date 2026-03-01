import React, { useEffect, useState } from 'react'
import ProfileImage from './ProfileImage'
import { Heart, Send } from 'lucide-react'
import { timeAgo } from '../lib/timeAgo';
import { useSelector } from 'react-redux';

const Comments = ({comments}) => {  
  
  return (
    <div className='p-2 pt-10 overflow-scroll h-[450px] no-scrollbar '>
        {[...(comments ?? [])].reverse().map((comment) => (
          <div key={comment?.id} className="flex gap-3 group bg-gray-200 m-1 p-2 rounded-2xl">
            <ProfileImage user={comment?.user} className="w-9 h-9 ml-5 rounded-full object-cover" />

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
            <button className=" transition">
              <Heart size={16} className="text-red-600 hover:fill-red-600 hover:scale-110 mr-5" />
            </button>
          </div>
        ))}
    
    </div>
  )
}

export default Comments