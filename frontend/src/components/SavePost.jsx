import { Bookmark } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setSavedPosts } from '../redux/slices/userSlice'


const SavePost = ({post}) => {
    const {user : currentUser} = useSelector((state)=>state.user)
    const [isSaved, setIsSaved] = useState(false)
    const dispatch = useDispatch()      
    

    // Toggle Save Post
    const toggleSavePost = async()=>{
        try {
            const res = await axiosInstance.put(`/post/${post._id}/save`)
            setIsSaved(res.data.isSaved)
            if (res.data.success) {                
                dispatch(setSavedPosts(res?.data?.savedPosts))
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Checking if post is saved or not
    useEffect(() => {
        if (currentUser?.savedPosts?.includes(post._id)) {
            setIsSaved(true)
        }else{
            setIsSaved(false)
        }
    }, [currentUser?.savedPosts])
  return (
    <div>

        {isSaved ? (
            <Bookmark onClick={()=>toggleSavePost()} className="cursor-pointer hover:scale-110 transition fill-black" />
        ) : (
            <Bookmark onClick={()=>toggleSavePost()} className="cursor-pointer hover:scale-110 transition" />
        )}
    </div>
  )
}

export default SavePost