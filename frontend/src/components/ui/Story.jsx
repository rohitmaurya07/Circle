import { ArrowLeft, ArrowRight, Eye, Pause, Play, PlusCircle, Volume2, VolumeOff } from 'lucide-react'
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
    const currentStoryUser = stories[currentUserIndex]?.user

    // check if last story
    const isLastStoryOfLastUser =
        currentUserIndex === stories.length - 1 &&
        currentStoryIndex === currentUserStories.length - 1;

    const canGoPrevious = currentUserIndex > 0 || currentStoryIndex > 0
    const canGoNext = !isLastStoryOfLastUser

    // Getting all the stories
    const getAllStories = async () => {
        try {
            const { data } = await axiosInstance.get("/story/all")
            console.log(data?.stories);

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
        console.log("hello", index, currentStoryUser);

        setcurrentUserIndex(index)
        setShowStoryModal(true)
        setcurrentStoryIndex(0)
        setprogressBar(0)
        setIsPlaying(true)
    }

    const handleStoryView = (storyId) => {
        console.log(storyId);
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
        if (currentStory?.mediaType === "video") {
            const video = videoRef.current
            return video ? !video.paused : isPlaying
        }
        return isPlaying
    }
    const currentPlayState = getCurrentPlayState()

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
        if (isLastStoryOfLastUser) {
            setTimeout(() => {
                setShowStoryModal(false)
            }, 300);
            return;
        }

        const currentUserStories = stories[currentUserIndex]?.stories || [];

        if (currentStoryIndex < currentUserStories.length - 1) {
            setcurrentStoryIndex(prev => prev + 1)
            setprogressBar(0)
            setIsPlaying(true)
        } else if (currentUserIndex < stories.length - 1) {
            setcurrentUserIndex(prev => prev + 1)
            setcurrentStoryIndex(0)
            setprogressBar(0)
            setIsPlaying(true)
        } else {
            setShowStoryModal(false) // Fallback close
        }
    }, [stories, currentUserIndex, currentStoryIndex, isLastStoryOfLastUser, setShowStoryModal, setcurrentStoryIndex, setprogressBar, setIsPlaying])



    // Handle Story Progress

        useEffect(() => {
      if (!showStoryModal || !currentStory) {
        return
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      if (currentStory.mediaType === "video") {
        const video = videoRef.current
        if (!video) return
        video.muted = isMuted
        if (isPlaying) {
            video.currentTime = 0
            video.play().catch((err) => console.log("Video Play Error", err))
            setIsPlaying(false)
        }else {
            video.pause()
        }
        
      }else if (currentStory.mediaType === "image") {
        const imageDuration = 5000
        const startTime = Date.now() - (progressBar / 100) * imageDuration
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min(100, (elapsed / imageDuration) * 100)
            setprogressBar(newProgress)
            if (newProgress >= 100) {
                clearInterval(progressIntervalRef.current)
                progressIntervalRef.current = null
                handleNextStory()
            }
        }, 100)
      }
      
      
    }, [showStoryModal, progressBar, currentStory, isMuted, handleNextStory])


    // Handle Video Progress

    useEffect(() => {
        const video = videoRef.current
      if (!video || !currentStory?.mediaType === "video") return

      const handleTimeUpdate = ()=>{
        if (video.duration) {
            const progress = (video.currentTime / video.duration) * 100
            setprogressBar(progress)
        }
      }
      const handleVideoEnded = ()=>{
        setprogressBar(100)
        handleNextStory()
      }

      video.addEventListener("timeupdate", handleTimeUpdate)
      video.addEventListener("ended", handleVideoEnded)
      return ()=>{
        video.removeEventListener("timeupdate", handleTimeUpdate)
        video.removeEventListener("ended", handleVideoEnded)
      }
    }, [currentStory, handleNextStory])

    
    
    // Reset Progress Bar
    useEffect(() => {
        if (!showStoryModal || !currentStory) return
      setprogressBar(0)
    
      if (currentStory.mediaType === "video") {
            const video = videoRef.current
            if (!video) {
                video.currentTime = 0
            }
      }
    }, [currentStory, showStoryModal])



    // Auto Close Stories
    useEffect(() => {
        if (showStoryModal || isLastStoryOfLastUser && progressBar >= 100) {
            const timer = setTimeout(() => {
                setShowStoryModal(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [showStoryModal, isLastStoryOfLastUser, progressBar])
        


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

                <div className='flex  space-x-4 overflow-x-auto no-scrollbar '>

                    {stories.map((userStories, index) => (
                        <div key={userStories.user?._id} onClick={() => handleUserClick(index)} className='flex flex-col items-center cursor-pointer shrink-0 '>
                            <div className={`p-0.5 rounded-full bottom-2 transition-all duration-200 ${index === currentUserIndex ? 'ring-2 ring-content - ring-offset-2 scale-105' : 'hover:scale-105'}`}>
                                <img src={userStories?.user?.profileImage || '/default-avatar.png'} alt={userStories?.user?.username} className='w-14 h-14 rounded-full border-2 border-highlight object-cover' />
                            </div>
                            <span className='text-content text-sm'>{userStories?.user?._id === currentUser?.id ? "Your Story" : userStories?.user?.username} </span>

                        </div>
                    ))}
                </div>

                {/* Create Story Modal */}
                <Modal open={isCreateStoryModal} onOpenChange={setIsCreateStoryModal}>
                    <div className='w-full max-w-2xl '>
                        <CreateMedia />
                    </div>
                </Modal>

                {/* Show Story Modal */}
                <Modal open={showStoryModal} onOpenChange={setShowStoryModal}>
                    <div className='w-full max-w-2xl '>
                        <div className='absolute top-0 left-0 right-0 z-10 flex space-x-1 p-3'>
                            {
                                currentUserStories.map((story, index) => (
                                    <div key={story._id} className='flex flex-1 h-1 bg-gray-600 rounded-full overflow-hidden '>
                                        <div className='h-full bg-white transition-all duration-200 ease-linear' style={{ width: index === currentStoryIndex ? `${progressBar}%` : index < currentStoryIndex ? '100%' : '0%' }}>

                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Story Header */}
                        <div className='absolute top-4 left-4 right-4 z-10 flex items-center space-x-3'>
                            <div className='flex items-center space-x-2'>
                                <img src={currentStoryUser?.profileImage || '/default-avatar.png'} alt={currentUser?.username} className='w-8 h-8 rounded-full border-2 border-highlight object-cover' />
                                <span className='text-red text-sm'>{currentStoryUser?.username}</span>
                                <span className='text-red text-sm'>12 yrs ago</span>
                            </div>

                            <div className='flex items-center space-x-3'>
                                {/* Play & Pause */}
                                <button className='text-content hover:opacity-80 transition-opacity p-2 bg-base bg-opacity-50 rounded-full '>
                                    {currentPlayState ? <Pause size={20} /> : <Play size={20} />}
                                </button>

                                {/* Muted & UnMute */}
                                {currentStory?.mediaType === "video" && (
                                    <button onClick={handleMediaVolume} className='text-content hover:opacity-80 transition-opacity p-2 bg-base bg-opacity-50 rounded-full '>
                                        {isMuted ? <Volume2 size={20} /> : <VolumeOff size={20} />}
                                    </button>
                                )}

                                {currentStoryUser?._id === currentUser?.id && (
                                    <button className='text-content hover:opacity-80 transition-opacity p-2 bg-base bg-opacity-50 rounded-full '>
                                        <Eye size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Story Content */}
                        <div className='flex items-center justify-center h-full pt-12 pb-20'>
                            {currentStory?.mediaType === "image" ? (
                                <img onLoad={() => handleStoryView(currentStory?._id)} src={currentStory?.mediaUrl} alt={currentStory?.caption} className='w-full h-full object-cover' />
                            ) : (
                                <video
                                    onLoadedData={() => handleStoryView(currentStory?._id)}
                                    ref={videoRef} src={currentStory?.mediaUrl}
                                    autoPlay
                                    muted
                                    loop
                                    className='w-full h-full object-cover'
                                    playsInline
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                            )}
                        </div>

                        {/* Caption */}
                        {currentStory?.caption && (
                            <div className='absolute bottom-4 left-4 right-4 z-10'>
                                <p className='text-highlight text-sm'>{currentStory?.caption}</p>
                            </div>
                        )}

                        {/* Naviagtion */}
                        <div className='absolute inset-0 flex justify-between items-center pointer-events-none'>
                            <button onClick={handlePreviousStory}
                                disabled={!canGoPrevious}
                                className={`${canGoPrevious ? 'opacity-20 hover:opacity-100 ' : 'opacity-0 hover:opacity-0'} w-1/2 h-full flex items-center justify-start  pointer-events-auto transition-opacity duration-300 ease-in-out`}>
                                <div className='bg-content text-highlight p-2 rounded-full'><ArrowLeft size={20} /></div>
                            </button>
                            <button onClick={handleNextStory}
                                disabled={!canGoNext}
                                className={`${canGoNext ? 'opacity-20 hover:opacity-100 ' : 'opacity-0 hover:opacity-0'} w-1/2 h-full flex items-center justify-end pointer-events-auto transition-opacity duration-300 ease-in-out`}>
                                <div className='bg-content p-2 rounded-full'><ArrowRight size={20} /></div>
                            </button>
                        </div>

                    </div>
                </Modal>
            </div>
        </>
    )
}

export default Story