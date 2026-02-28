import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '../redux/slices/postSlice'
import PostCard from './PostCard'

const Feed = () => {

    const dispatch = useDispatch()
    const {posts} = useSelector(state => state.posts)


    useEffect(() => {
      dispatch(getAllPosts())
    }, [dispatch])
    

  return (
    <div>
        { posts ? posts.map((post) => <PostCard key={post._id} post={post}/>) : <p>No Posts</p>}
    </div>
  )
}

export default Feed