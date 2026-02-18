import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Pause,
  Play,
  PlusCircle,
  Send,
  Volume2,
  VolumeOff,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import CreateMedia from "./CreateMedia";
import { Modal } from "./Modal";
import { getAllStories } from "../../redux/slices/storySlice";

const Story = () => {
  const dispatch = useDispatch()
  const {stories} = useSelector((state) => state.story)
  const { user: currentUser } = useSelector((state) => state.user);

  const videoRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isCreateStoryModal, setIsCreateStoryModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentModel, setshowCommentModel] = useState(false)

  const currentUserStories = stories[currentUserIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories[currentUserIndex]?.user;

  const isLastStoryOfLastUser =
    currentUserIndex === stories.length - 1 &&
    currentStoryIndex === currentUserStories.length - 1;

  const canGoPrevious = currentUserIndex > 0 || currentStoryIndex > 0;
  const canGoNext = !isLastStoryOfLastUser;


  useEffect(() => {
    dispatch(getAllStories())
  }, [dispatch]);

 
  // Navigation
  const handleNextStory = useCallback(() => {
    if (isLastStoryOfLastUser) {
      setShowStoryModal(false);
      return;
    }

    if (currentStoryIndex < currentUserStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
    }

    setProgressBar(0);
    setIsPlaying(true);
  }, [
    isLastStoryOfLastUser,
    currentStoryIndex,
    currentUserStories.length,
  ]);

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      const prevUserStories = stories[currentUserIndex - 1]?.stories || [];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(prevUserStories.length - 1);
    }

    setProgressBar(0);
    setIsPlaying(true);
  };

  // Play / Pause
  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleMediaVolume = () => {
    setIsMuted((prev) => !prev);
  };

  // HELPER
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return null;
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "Just now";
  };

  // STORY PROGRESS CONTROLLER
  useEffect(() => {
    if (!showStoryModal || !currentStory) return;

    clearInterval(progressIntervalRef.current);

    // IMAGE STORY
    if (currentStory.mediaType === "image") {
      if (!isPlaying) return;

      const duration = 5000; // 5 seconds

      progressIntervalRef.current = setInterval(() => {
        setProgressBar((prev) => {
          const next = prev + 100 / (duration / 100);

          if (next >= 100) {
            clearInterval(progressIntervalRef.current);
            handleNextStory();
            return 100;
          }

          return next;
        });
      }, 100);
    }

    // -----------------------
    // VIDEO STORY
    // -----------------------
    if (currentStory.mediaType === "video") {
      const video = videoRef.current;
      if (!video) return;

      video.muted = isMuted;

      if (isPlaying) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [currentStory, isPlaying, showStoryModal, isMuted, handleNextStory]);

  // =============================
  // VIDEO PROGRESS TRACKING
  // =============================
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentStory?.mediaType !== "video") return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgressBar((video.currentTime / video.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleNextStory();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentStory, handleNextStory]);

  // =============================
  // UI
  // =============================
  return (
    <div className="flex gap-4">
      {/* CREATE STORY */}
      <div>
        <div className="bg-content h-15 w-15 rounded-full border-4 border-base relative">
          <PlusCircle
            onClick={() => setIsCreateStoryModal(true)}
            className="text-surface absolute bottom-0 right-0 bg-content rounded-full cursor-pointer"
          />
        </div>
        <span className="text-content text-sm">Create Story</span>
      </div>

      {/* USERS LIST */}
      <div className="flex space-x-4 overflow-x-auto no-scrollbar">
        {stories.map((userStories, index) => (
          <div
            key={userStories.user?._id}
            onClick={() => {
              setCurrentUserIndex(index);
              setCurrentStoryIndex(0);
              setShowStoryModal(true);
              setIsPlaying(true);
              setProgressBar(0);
            }}
            className="flex flex-col items-center cursor-pointer shrink-0"
          >
            <img
              src={
                userStories?.user?.profileImage || "/default-avatar.png"
              }
              alt={userStories?.user?.username}
              className="w-14 h-14 rounded-full border-2 border-highlight object-cover"
            />
            <span className="text-content text-sm">
              {userStories?.user?._id === currentUser?.id
                ? "Your Story"
                : userStories?.user?.username}
            </span>
          </div>
        ))}
      </div>

      {/* STORY MODAL */}
      <Modal open={showStoryModal} onOpenChange={setShowStoryModal}>
        <div className="w-full h-full relative flex flex-col bg-black">

          {/* PROGRESS BARS */}
          <div className="absolute top-0 left-0 right-0 flex space-x-1 p-3 z-10">
            {currentUserStories.map((story, index) => (
              <div key={story._id} className="flex-1 h-1 bg-gray-600 rounded">
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width:
                      index === currentStoryIndex
                        ? `${progressBar}%`
                        : index < currentStoryIndex
                          ? "100%"
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* USER DETAILS */}
          <div className="absolute top-6 left-4 flex items-center gap-3 z-20">
            <img
              src={currentStoryUser?.profileImage || "/default-avatar.png"}
              alt={currentStoryUser?.username}
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div className="flex gap-2 items-center">
              <span className="text-white font-semibold text-sm drop-shadow-md">
                {currentStoryUser?.username}
              </span>
              <span className="text-white/70 text-xs font-medium drop-shadow-md">
                {formatTimeAgo(currentStory?.createdAt)}
              </span>
            </div>
          </div>

          {/* MEDIA */}
          <div className="flex-1 flex items-center justify-center w-full h-full relative overflow-hidden bg-black">
            {currentStory?.mediaType === "image" ? (
              <img
                src={currentStory?.mediaUrl}
                alt=""
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                src={currentStory?.mediaUrl}
                className="w-full h-full object-contain"
                playsInline
              />
            )}
          </div>

          {/* CONTROLS */}
          <div className="absolute top-7 right-4 flex gap-3 z-30">
            <button onClick={() => setShowStoryModal(false)} className="text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors">
              <X size={24} />
            </button>
            <button onClick={handlePlayPause} className="text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {currentStory?.mediaType === "video" && (
              <button onClick={handleMediaVolume} className="text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors">
                {isMuted ? <VolumeOff size={24} /> : <Volume2 size={24} />}
              </button>
            )}
          </div>


          {/* NAVIGATION */}
          <div className="absolute inset-0 flex justify-between items-center">
            <button
              onClick={handlePreviousStory}
              disabled={!canGoPrevious}
              className="w-1/2 h-full"
            />
            <button
              onClick={handleNextStory}
              disabled={!canGoNext}
              className="w-1/2 h-full"
            />
          </div>

          {/* on hold pause story */}
          <div className="absolute inset-0 flex justify-between items-center">
            <button
              onMouseDown={() => setIsPlaying(false)}
              onMouseUp={() => setIsPlaying(true)}
              className="w-1/2 h-full"
            />
          </div>

          {/* Bottom */}

          <div className="flex justify-between items-center absolute bottom-0 left-0 right-0 p-4 z-20 bg-linear-to-t from-black/80 to-transparent pt-10">
            <div className="flex gap-4 cursor-pointer">
              <Heart size={25} className="text-white relative z-20" />
              <MessageCircle onClick={()=>setshowCommentModel(true)} size={25} className="text-white" />
            </div>
            <div className="flex border-2 border-white rounded-full p-2 cursor-pointer">
              <input type="text" placeholder="Send a message" className="bg-transparent border-none outline-none text-white w-[250px] px-2" />
              <Send size={25} className="text-white " />
            </div>
          </div>

{/* Show All Comments */}
          {showCommentModel && (
            <div className="absolute bottom-1  bg-content z-60 w-full">
                <h4 className="text-white text-2xl font-bold">Comments</h4>
                 <div className="flex flex-col gap-2">
                  {[10,20,30].map(()=>{
                    return(
                      <div className="comment border-2 border-gray-600">
                        <img src="" alt="" srcset="" />
                        <div>
                          <p>username</p>
                        <p>Hello how are u</p>
                        </div>
                    </div>
                    )
                  })}
                 </div>
                 <div className="flex border-2 border-white rounded-full p-2 cursor-pointer">
                  <input type="text" placeholder="Add a Comment" className="bg-transparent border-none outline-none text-white w-[250px] px-2" />
                  <Send size={25} className="text-white cursor-pointer" />
                 </div>
            </div>
          )}

        </div>
      </Modal>
    </div>
  );
};

export default Story;
