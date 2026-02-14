import { PlusCircle } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../../lib/axios';
import { useSelector } from 'react-redux';
import CreateMedia from './CreateMedia';
import { Modal } from './Modal';

const Story = () => {
    const [stories, setStories] = useState([])

    const { user: currentUser } = useSelector((state => state.user))

    const createModelRef = useRef(null)
    const storyModelRef = useRef(null)
    const videoRef = useRef(null)
    const progressIntervalRef = useRef(null)

    const [currentUserIndex, setcurrentUserIndex] = useState(0)
    const [currentStoryIndex, setcurrentStoryIndex] = useState(0)
    const [showStoryModal, setShowStoryModal] = useState(false)
    const [showCommentModal, setshowCommentModal] = useState(false)
    const [showViewStoryModel, setshowViewStoryModel] = useState(false)

    const [isCreateStoryModal, setIsCreateStoryModal] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [progressBar, setprogressBar] = useState(0)
    const [isMuted, setisMuted] = useState(false)

    const currentUserStories = stories[currentUserIndex]?.stories || []
    const currentStory = currentUserStories[currentStoryIndex]
    const currentStoryUser = stories[currentStoryIndex]?.user

    // check if last story
    const isLastStoryOfLastUser = currentStoryIndex === stories.length - 1 && currentStoryIndex === currentUserStories.length - 1


    // Getting all the stories
    const getAllStories = async () => {
        try {
            const { data } = await axiosInstance.get("/story/all")
            setStories(data?.stories)
        } catch (error) {
            console.log("Error While Getting STories", error);

        }
    }

    useEffect(() => {
        getAllStories()
    }, [])


    // Handle Create Story
    const handleCreateStory = () => {
        setIsCreateStoryModal(true)
    }
    // Handle Show Story Model
    const handleShowStoryModel = () => {
        setShowStoryModal(true)
    }

    // Handle User Click
    const handleUserClick = (index) => {
        setcurrentUserIndex(index)
        setShowStoryModal(true)
        setcurrentStoryIndex(0)
        setprogressBar(0)
        setIsPlaying(true)
    }

    const handlePlayPause = () => {
        if (currentStory ? mediaType === "video" : false) {
            const video = videoRef.current
            if (isPlaying) {
                video.pause()
                setIsPlaying(false)
            } else {
                video.play()
                setIsPlaying(true)
            }
        }
    }
    const handleMediaVolume = () => {
        const newMutedState = !isMuted
        setisMuted(newMutedState)
        if (currentStory ? mediaType === "video" : false) {
            const video = videoRef.current
            if (video) {
                video.muted = newMutedState
            }
        }
    }

    const getCurrentPlayState = () => {
        if (currentStory ? mediaType === "video" : false) {
            const video = videoRef.current
            return video ? !video.paused : isPlaying
        }
        return isPlaying
    }

    const handlePreviousStory = () => {
        if (currentStoryIndex > 0) {
            setcurrentStoryIndex(currentStoryIndex - 1)
            setprogressBar(0)
            setIsPlaying(true)
        } else if (currentUserIndex > 0) {
            setcurrentUserIndex(currentUserIndex - 1)
            setcurrentStoryIndex(stories[currentUserIndex - 1].stories.length - 1)
            setprogressBar(0)
            setIsPlaying(true)
        }
    }

    const handleNextStory = useCallback(() => {
        const currentUserStories = stories[currentUserIndex].stories
        if (isLastStoryOfLastUser) {
            setTimeout(() => {
                setShowStoryModal(false)
            }, 300);
        }
        return

        if (currentStoryIndex < currentUserStories.length - 1) {
            setcurrentStoryIndex(currentStoryIndex + 1)
            setprogressBar(0)
            setIsPlaying(true)
        } else if (currentUserIndex < stories.length - 1) {
            setcurrentUserIndex(currentUserIndex + 1)
            setcurrentStoryIndex(0)
            setprogressBar(0)
            setIsPlaying(true)
        } else {
            setShowStoryModal(false)
        }
    }, [stories, currentUserIndex, currentStoryIndex, isLastStoryOfLastUser, setShowStoryModal, setcurrentStoryIndex, setprogressBar, setIsPlaying])





    return (
        <>
        <div className='flex gap-4'>

            <div>
                <div className='bg-content h-15 w-15 rounded-full border-4 border-base'>
                    <div>
                        <PlusCircle onClick={() => handleCreateStory()} className='text-surface relative top-8 left-8 bg-content rounded-full' />
                    </div>
                </div>
                <span className='text-content text-sm'>Create Story</span>
            </div>

            <div className='flex  space-x-4 overflow-x-auto no-scrollbar'>

                {stories.map((userStories, index) => (
                    <div key={userStories.user.id} onClick={() => handleUserClick()} className='flex flex-col items-center cursor-pointer shrink-0 '>
                        <div className={`p-0.5 rounded-full bottom-2 transition-all duration-200 ${index === currentUserIndex ? 'ring-2 ring-content - ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                            <img src={userStories?.user?.profileImage || '/default-avatar.png'} alt={userStories?.user?.username} className='w-14 h-14 rounded-full border-2 border-highlight object-cover' />
                        </div>
                        <span className='text-content text-sm'>{userStories?.user?._id === currentUser?.id ? "Your Story" : userStories?.user?.username} </span>

                    </div>
                ))}
            </div>

            {/* Create Story Modal */}
            <Modal  open={isCreateStoryModal} onOpenChange={setIsCreateStoryModal}>
                <div className='w-full max-w-2xl '>
                    <CreateMedia />
                </div>
            </Modal> 

            {/* Show Story Modal */}
            <Modal  open={showStoryModal} onOpenChange={setShowStoryModal}>
                <div className='w-full max-w-2xl '>
                    <CreateMedia />
                </div>
            </Modal> 
        </div>
        </>
    )
}

export default Story