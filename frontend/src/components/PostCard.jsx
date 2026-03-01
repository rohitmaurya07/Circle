import React, { useEffect, useState } from 'react'
import MediaIcons from './MediaIcons'
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';
import { Modal } from './ui/Modal';
import Comments from './Comments';
import { useSelector } from 'react-redux';
import { Send } from 'lucide-react';
import { axiosInstance } from '../lib/axios';

const PostCard = ({ post }) => {
  const [showCommentModel, setShowCommentModel] = useState(false)
  const { user: currentUser } = useSelector((state) => state.user);
  const [commentText, setcommentText] = useState("")
  const [userComments, setuserComments] = useState(post?.comment)
  
// console.log(post);

  useEffect(() => {
    setuserComments(post?.comment)
  }, [post?.comment])
  

  const postComment = async (postId) => {

    if (!commentText.trim()) return
    
    try {
        const res = await axiosInstance.post(`/post/${postId}/comment`, { text: commentText });
        setuserComments(res.data.comment)
        setcommentText("")
        
    } catch (error) {
      
    }
  }

  return (
    <div className='bg-gray-200 rounded-2xl m-5 p-5'>
      <div className=' w-[400px]'>

        {/* Header */}
        <div className='flex gap-2 justify-between  bg-gray-300 text-black rounded-3xl px-2 py-2'>
          <div className='flex gap-2'>
            <ProfileImage user={post?.user} className="w-9 h-9 rounded-full object-cover" />
            <p>{post?.user?.username}</p>
          </div>
          <FollowButton user={post?.user} />
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
          <MediaIcons showCommentModel={showCommentModel} setShowCommentModel={setShowCommentModel} post={post} />
        </div>
      </div>




      {/* Comment Model */}
      {showCommentModel && <div className="">
        <Modal open={showCommentModel} onOpenChange={setShowCommentModel}>
          <Comments comments={userComments} />
          {/* Add Comment */}
          <div className='flex gap-3 group bg-gray-200 m-1 p-2 rounded-2xl bg-surface'>
            <ProfileImage user={currentUser?.user} className="w-9 h-9 ml-5 rounded-full object-cover" />
            <input value={commentText} onChange={(e)=>setcommentText(e.target.value)} type="text" placeholder='Add a comment' className='w-full bg-transparent border-none outline-none text-white' />
            <Send onClick={() => postComment(post?._id)} className='cursor-pointer hover:scale-110 transition mr-2 ' />
          </div>
        </Modal>
      </div>}
    </div>
  )
}

export default PostCard