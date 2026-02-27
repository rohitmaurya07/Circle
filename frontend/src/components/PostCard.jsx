import React, { useEffect, useRef, useState } from "react";
import {MapPin, Volume, Volume2, VolumeX } from "lucide-react";
import ProfileImage from "./ProfileImage";
import FollowButton from "./FollowButton";
import { useSelector } from "react-redux";
import MediaIcons from "./MediaIcons";

const Postcard = ({post}) => {

    const { user: currentUser } = useSelector(state => state.user)
    const [isMuted, setisMuted] = useState(true)
    const videoRef = useRef()

    const handleVideoClick = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play();
        video.muted = false;
      } else {
        video.pause();
      }
    };

    const handleMute = () => {
      setisMuted(!isMuted)
      videoRef.current.muted = !videoRef.current.muted
    }

    // InterSection Observer
    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.playing = false
            video.muted = false
          } else {
            video.pause()
          }
        })
      }, { threshold: 0.5 })

      observer.observe(video)

      return () => {
        observer.disconnect()
      }
    }, [])
    

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 w-2xl my-5">

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <ProfileImage user={post?.user} username />
          <div>
            <p className="font-semibold text-sm">{post?.user?.username}</p>
            <div className="flex items-center text-xs text-gray-500 gap-1">
              <MapPin size={14} />
              location
            </div>
          </div>
        </div>
        <div className="text-gray-400 text-xl">
          <FollowButton postUser={post?.user?._id} currentUser={currentUser?._id} />
        </div>
      </div>

      {/* Image Section */}
      <div className="relative">
        {post?.mediaType === "image" ? (
          <img
            src={post?.mediaUrl}
            alt="post"
            className="w-full h-[400px] object-cover"
          />
        ) : (
          <div className="flex w-full items-center justify-center">
            <button className="absolute top-5 right-25 z-20 bg-white rounded-full p-1" onClick={() => handleMute()}>
              {isMuted ? <VolumeX className="text-content " /> : <Volume2 className="text-content " />}
            </button>
            <video
              ref={videoRef}
              onClick={() => handleVideoClick()}
              src={post?.mediaUrl}
              muted
              playsInline
              loop
              autoPlay
              className="h-[400px] object-cover cursor-pointer"
            />
          </div>
        )}

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Actions */}
      <MediaIcons post={post} />

      
    </div>
  );
};

export default Postcard;