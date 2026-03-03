import React, { useEffect, useState } from 'react'
import MediaIcons from './MediaIcons'
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';
import { Modal } from './ui/Modal';
import Comments from './Comments';
import { useSelector } from 'react-redux';
import { Send } from 'lucide-react';
import { axiosInstance } from '../lib/axios';

const PostCard = ({ post , place }) => {
  const { user: currentUser } = useSelector((state) => state.user);

  // Comment State
  const [userComments, setuserComments] = useState(post?.comment)
  const [showCommentModel, setShowCommentModel] = useState(false)
  const [commentText, setcommentText] = useState("")

  const [isProfilePage, setIsProfilePage] = useState(place === "profile")
  const [isSavedPage, setIsSavedPage] = useState(place === "saved")

  // Update Comment State
  useEffect(() => {
    setuserComments(post?.comment)
  }, [post?.comment])


  // Post Comment
  const postComment = async (postId) => {
    if (!commentText.trim()) return
    try {
      const res = await axiosInstance.post(`/post/${postId}/comment`, { text: commentText });
      setuserComments(res?.data?.comment)
      setcommentText("")
    } catch (error) {
      console.log(error);
    }
  }

  return (
  <div className="bg-gray-200 rounded-2xl m-3 sm:m-5 p-3 sm:p-5 w-full max-w-md mx-auto">
    
    <div className="w-full">
      {/* Header */}
      {!isProfilePage && (<div className="flex gap-2 justify-between bg-gray-300 text-black rounded-3xl px-3 py-2">
        <div className="flex gap-2 items-center">
          <ProfileImage
            user={post?.user}
            username={post?.user?.username}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
          />
        </div>
        <FollowButton user={post?.user} />
      </div>)}

      {/* Media */}
      <div className="aspect-square bg-content rounded-3xl mt-3 overflow-hidden">
        {post?.mediaType === "image" ? (
          <img
            src={post?.mediaUrl}
            alt="post"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={post?.mediaUrl}
            controls
            muted
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        )}

      </div>

      {/* Icons */}
      <div className="mt-2">
        <MediaIcons
          showCommentModel={showCommentModel}
          setShowCommentModel={setShowCommentModel}
          post={post}
        />
      </div>
    </div>

    <p>{post?.caption}</p>

    {/* Comment Modal */}
    {showCommentModel && (
      <Modal
        intialHeight="h-[70vh]"
        intialWidth="w-[95vw] sm:w-[400px]"
        open={showCommentModel}
        onOpenChange={setShowCommentModel}
      >
        {userComments?.length > 0 ? (
          <Comments comments={userComments} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No Comments</p>
          </div>
        )}

        {/* Comment Input */}
        <div className="flex absolute bottom-2 left-0 right-0 px-3 gap-2 bg-gray-200 p-2 rounded-2xl">
          <ProfileImage
            user={currentUser?.user}
            className="w-8 h-8 rounded-full object-cover"
          />

          <input
            value={commentText}
            onChange={(e) => setcommentText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && postComment(post?._id)
            }
            type="text"
            placeholder="Add a comment"
            className="flex-1 bg-transparent border-none outline-none text-black text-sm"
          />

          <Send
            onClick={() => postComment(post?._id)}
            size={24}
            className="cursor-pointer hover:scale-125 transition"
          />
        </div>
      </Modal>
    )}
  </div>
);
}

export default PostCard