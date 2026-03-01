import {ArrowLeft,ArrowRight,Eye,Heart,MessageCircle,Pause,Play,PlusCircle,Send,Volume2,VolumeOff,X,} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import CreateMedia from "./CreateMedia";
import { Modal } from "./Modal";
import { getAllStories } from "../../redux/slices/storySlice";
import axios from "axios";
import ProfileImage from "../ProfileImage";
import Comments from "../Comments";
import { timeAgo } from "../../lib/timeAgo";
import CommentInput from "../CommentInput";


const Story = () => {
  const dispatch = useDispatch()
  const { stories } = useSelector((state) => state.story)
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
  const [showStoryViewers, setshowStoryViewers] = useState(false)

  const currentUserStories = stories[currentUserIndex]?.stories || [];
  const currentStory = currentUserStories[currentStoryIndex];
  const currentStoryUser = stories[currentUserIndex]?.user;

  // Local state for instant story comment updates
  const [localStoryComments, setLocalStoryComments] = useState([]);

  useEffect(() => {
    setLocalStoryComments(currentStory?.comments || []);
  }, [currentStory?.comments]);

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
            progressIntervalRef.current = null;
            handleNextStory();
            return 100;

          }

          return next;
        });
      }, 100);
    }

    
    // VIDEO STORY
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


  // Comments Modal
  useEffect(() => {
    if (showCommentModel || showStoryViewers) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }, [showCommentModel, showStoryViewers]);



  // VIDEO PROGRESS TRACKING
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

  const handleViewStory = async (storyID) => {
    console.log(storyID);
    try {
      await axiosInstance.put(`/story/${storyID}/view`)
    } catch (error) {
      console.log(error);

    }

  }
  const handleViewStoryModal = () => {
    setshowStoryViewers(true);
  }



  return (
    <div className="flex gap-4">
      {/* CREATE STORY */}
      <div>
        <div className="bg-content h-15 w-15 rounded-full border-4 border-base relative">
          <Modal open={isCreateStoryModal} onOpenChange={setIsCreateStoryModal}>
            <CreateMedia type="story" />
          </Modal>
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
            className="flex flex-col items-center cursor-pointer shrink-0 "
          >
            <img
              src={
                userStories?.user?.profileImage || `https://placehold.co/600x400?text=${userStories?.user?.username.slice(0, 1).toUpperCase()}`
              }
              alt={userStories?.user?.username}
              className="w-15 h-15 rounded-full border-4 border-base  object-cover"
            />
            <span className="text-content text-sm">
              {userStories?.user?._id === currentUser?._id
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
            <ProfileImage user={currentStoryUser} username={currentStoryUser?.username} className="w-10 h-10 rounded-full border border-white/20 object-cover" />
            <div className="flex gap-2 items-center">
              <span className="text-white/70 text-xs font-medium drop-shadow-md">
                {timeAgo(currentStory?.createdAt)}
              </span>
            </div>
          </div>

          {/* MEDIA */}
          <div className="flex-1 flex items-center justify-center w-full h-full relative overflow-hidden bg-black">
            {currentStory?.mediaType === "image" ? (
              <img
                src={currentStory?.mediaUrl}
                onLoad={() => handleViewStory(currentStory._id)}
                alt=""
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={videoRef}
                onLoadedData={() => handleViewStory(currentStory._id)}
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
            <button onClick={() => handleViewStoryModal()} className="text-white cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors">
              <Eye size={24} />
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
              className="w-1/2 h-full z-20"
            />
            <button
              onClick={handleNextStory}
              disabled={!canGoNext}
              className="w-1/2 h-full z-20"
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
              <MessageCircle onClick={() => setshowCommentModel(true)} size={25} className="text-white" />
            </div>
            <div className="flex border-2 border-white rounded-full p-2 cursor-pointer">
              <input type="text" placeholder="Send a message" className="bg-transparent border-none outline-none text-white w-[250px] px-2" />
              <Send size={25} className="text-white " />
            </div>
          </div>


          {/* VIEWERS PANEL */}
          {showStoryViewers && (
            <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm">

              {/* CONTAINER */}
              <div className="w-full h-[75%] bg-[#0f0f0f] rounded-t-3xl flex flex-col animate-slideUp">

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">

                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Viewers
                    </h3>
                    <p className="text-white/50 text-xs">
                      {currentStory?.viewers.length || "0"} people viewed
                    </p>
                  </div>

                  <button
                    onClick={() => setshowStoryViewers(false)}
                    className="hover:bg-white/10 p-2 rounded-full transition"
                  >
                    <X size={22} className="text-white" />
                  </button>
                </div>

                {/* VIEWERS LIST */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">

                  {currentStory?.viewers?.map((viewer) => (
                    <div
                      key={viewer}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <ProfileImage user={viewer} className="w-11 h-11 rounded-full object-cover" />
                        {/* USER INFO */}
                        <div>
                          <p className="text-white text-sm font-semibold">
                            {viewer?.username}
                          </p>
                          <p className="text-white/50 text-xs">
                            Viewed 2m ago
                          </p>
                        </div>
                      </div>

                    </div>
                  ))}

                </div>

              </div>
            </div>
          )}


          {/* COMMENTS PANEL */}
          {showCommentModel && (
            <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-sm" onClick={() => setIsPlaying(false)}>

              {/* COMMENT CONTAINER */}
              <div className="w-full h-[75%] bg-[#0f0f0f] rounded-t-3xl flex flex-col animate-slideUp">

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <h3 className="text-white text-lg font-semibold">
                    Comments
                  </h3>

                  <button
                    onClick={() => {
                      setshowCommentModel(false);
                      setIsPlaying(true);
                    }}
                    className="hover:bg-white/10 p-2 rounded-full transition"
                  >
                    <X size={22} className="text-white" />
                  </button>
                </div>

                {/* COMMENTS LIST */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar">
                  <Comments comments={localStoryComments} />
                </div>

                {/* INPUT AREA */}
                <CommentInput type="story" itemID={currentStory?._id} onCommentAdd={(newComments) => setLocalStoryComments(newComments)} />

              </div>
            </div>
          )}

        </div>
      </Modal>
    </div>
  );
};

export default Story;
