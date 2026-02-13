import { PlusCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../lib/axios';
import { useSelector } from 'react-redux';
import CreateMedia from './CreateMedia';

const Story = () => {
    const [stories, setStories] = useState("")

    const {user: currentUser} = useSelector((state => state.user))

    const getAllStories = async ()=>{
        try {
            const {data} = await axiosInstance.get("/story/all")
            setStories(data?.stories)
        } catch (error) {
            console.log("Error While Getting STories", error);
            
        }
    }
    
    useEffect(() => {
        getAllStories()
    }, [])

    const currentUserIndex = ''
    
    const handleCreateStory = () => {
        console.log("Create Story");
    }

    const handleUserClick = ()=>{

    }

    return (
        <>
            <div>
                <div className='bg-content h-15 w-15 rounded-full border-4 border-base'>
                    <div>
                        <PlusCircle onClick={() => handleCreateStory()} className='text-surface relative top-8 left-8 bg-content rounded-full' />
                    </div>
                </div>
                <span className='text-content text-sm'>Create Story</span>
            </div>

            <div className='flex space-x-4 overflow-x-auto no-scrollbar'>
                
                {stories.map((userStories,index)=> (
                    <div key={userStories.user.id} onClick={()=>handleUserClick()} className='flex flex-col items-center cursor-pointer shrink-0 '>
                        <div className={`p-0.5 rounded-full bottom-2 transition-all duration-200 ${index === currentUserIndex ? 'ring-2 ring-content - ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                            <img src={userStories?.user?.profileImage || '/default-avatar.png'} alt={userStories?.user?.username} className='w-14 h-14 rounded-full border-2 border-highlight object-cover' />
                        </div>
                    <span className='text-content text-sm'>{userStories?.user?._id === currentUser?.id ? "Your Story" : userStories?.user?.username } </span>

                    </div>
                    ))}
            </div>

            {/* Create Story Modal */}
            <div className='w-full max-w-2xl '>
                   <CreateMedia />     
            </div>
        </>
    )
}

export default Story