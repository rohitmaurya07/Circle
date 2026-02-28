import { Volume2, VolumeX } from 'lucide-react'
import React from 'react'

const Media = ({ post, isMuted, handleMute, handleVideoClick, videoRef }) => {
    return (
        <div className="relative w-full overflow-hidden bg-black flex items-center justify-center group aspect-[4/5] sm:aspect-square md:aspect-[5/5] max-h-[400px]">
            {post?.mediaType === "image" ? (
                <img
                    src={post?.mediaUrl}
                    alt="post"
                    className="w-full object-cover"
                />
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <button
                        className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 rounded-full p-2 text-white shadow-lg backdrop-blur-md transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); handleMute(); }}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <video
                        ref={videoRef}
                        onClick={() => handleVideoClick()}
                        src={post?.mediaUrl}
                        muted={isMuted}
                        playsInline
                        loop
                        autoPlay
                        className=" h-full object-cover cursor-pointer"
                    />
                </div>
            )}

            {/* Subtle bottom gradient to make overlay text/icons pop if added later */}
            <div className="pointer-events-none absolute inset-0 top-1/2 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
        </div>
    )
}

export default Media