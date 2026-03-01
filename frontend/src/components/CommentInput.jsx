import { Send } from 'lucide-react';
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';

const CommentInput = ({ type, itemID, onCommentAdd }) => {
  const [addComment, setaddComment] = useState("")

  const postComment = async () => {
    try {
      if (!addComment.trim()) return;
      const { data } = await axiosInstance.post(`/${type}/${itemID}/comment`, { text: addComment })
      if (data?.success) {
        setaddComment("")
        if (onCommentAdd) {
          onCommentAdd(data.comment || data.comments);
        }
      }
    } catch (error) {
      console.log("Error Commenting on Story", error);
    }

  }

  return (
    <div className=''>
      <div className="border-t border-gray-100 bg-white p-3">
        <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-white/30">

          <input
            onChange={(e) => { setaddComment(e.target.value) }}
            onKeyPress={(e) => e.key === "Enter" && postComment()}
            value={addComment}
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder:text-gray-400"
          />

          <button className="hover:scale-110 transition">
            <Send onClick={() => postComment()} size={20} className="text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentInput