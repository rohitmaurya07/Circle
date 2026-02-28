import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/slices/postSlice'
import PostCard from './PostCard'

const Feed = () => {

    const dispatch = useDispatch()
    const {posts} = useSelector(state => state.posts)

    const [commentText, setCommentText] = useState("")
    const onSubmitComment = () => {
      console.log("commentText",commentText);
    }
    const handleCommentChange = (e) => {
      setCommentText(e.target.value)
    }

    useEffect(() => {
      dispatch(getAllPosts())
    }, [dispatch])
    

  return (
    <div>
        { posts ? posts.map((post) => <PostCard key={post._id} post={post} commentText={commentText} setCommentText={setCommentText} onSubmitComment={onSubmitComment} />) : <p>No Posts</p>}
    </div>
  )
}

export default Feed