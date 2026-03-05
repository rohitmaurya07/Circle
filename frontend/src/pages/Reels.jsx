import React, { useState, useEffect, useRef, useCallback } from 'react'
import SideBar from '../components/ui/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { getReels } from '../redux/slices/reelsSlice'
import {
  Heart, MessageCircle, Send, Bookmark,
  VolumeX, Volume2, MoreHorizontal, Play, Music2
} from 'lucide-react'

const formatCount = (n = 0) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

/* ─── Single Reel Card ──────────────────────────────────────────── */
const ReelCard = ({ reel, isActive, muted, onMuteToggle }) => {
  const videoRef = useRef(null)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(reel.likes?.length ?? 0)
  const [playing, setPlaying] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [progress, setProgress] = useState(0)

  // Play / pause based on visibility
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (isActive) {
      v.currentTime = 0
      v.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [isActive])

  // Sync mute
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  // Progress bar
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (v && v.duration) setProgress((v.currentTime / v.duration) * 100)
  }

  // Tap to play/pause
  const handleVideoClick = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  // Double-tap like
  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true)
      setLikeCount(c => c + 1)
    }
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 900)
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <div
      className="relative flex-shrink-0 w-full h-full bg-black overflow-hidden"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.mediaUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={muted}
        onTimeUpdate={handleTimeUpdate}
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleTap}
        style={{ cursor: 'pointer' }}
      />

      {/* Dim gradient — bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 70%)',
        }}
      />

      {/* Floating heart on double-tap */}
      {showHeart && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ animation: 'heartPop 0.9s ease forwards' }}
        >
          <Heart size={90} fill="white" strokeWidth={0} style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }} />
        </div>
      )}

      {/* Play indicator */}
      {!playing && isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm rounded-full p-4">
            <Play size={32} fill="white" strokeWidth={0} />
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20">
        <div
          className="h-full bg-white transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom-left: user info + caption */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-5 pointer-events-none">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex-shrink-0 bg-zinc-800"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.15)' }}
          >
            {reel.user?.profileImage ? (
              <img src={reel.user.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800" />
            )}
          </div>
          <span className="text-white font-semibold text-sm drop-shadow">
            {reel.user?.username ?? 'user'}
          </span>
          <button
            className="pointer-events-auto text-white text-xs font-semibold border border-white/70 rounded-lg px-3 py-0.5 hover:bg-white/10 transition-colors"
            style={{ fontSize: '12px' }}
          >
            Follow
          </button>
        </div>

        {reel.caption && (
          <p className="text-white/90 text-sm leading-relaxed line-clamp-2 drop-shadow">
            {reel.caption}
          </p>
        )}

        {/* Audio ticker */}
        <div className="flex items-center gap-1.5 mt-2">
          <Music2 size={12} color="rgba(255,255,255,0.7)" />
          <span className="text-white/60 text-xs">Original audio · {reel.user?.username ?? 'user'}</span>
        </div>
      </div>

      {/* Right-side action buttons */}
      <div className="absolute right-3 bottom-6 flex flex-col items-center gap-5">
        {/* Like */}
        <button onClick={handleLike} className="flex flex-col items-center gap-1 group">
          <div className="p-1.5 rounded-full transition-transform duration-150 group-active:scale-75">
            <Heart
              size={27}
              fill={liked ? '#ff3040' : 'none'}
              stroke={liked ? '#ff3040' : 'white'}
              strokeWidth={1.8}
            />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">{formatCount(likeCount)}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="p-1.5 rounded-full transition-transform duration-150 group-active:scale-75">
            <MessageCircle size={27} stroke="white" strokeWidth={1.8} />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">{formatCount(reel.comment?.length)}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="p-1.5 rounded-full transition-transform duration-150 group-active:scale-75">
            <Send size={25} stroke="white" strokeWidth={1.8} style={{ transform: 'rotate(15deg)' }} />
          </div>
          <span className="text-white text-xs font-semibold drop-shadow">Share</span>
        </button>

        {/* Save */}
        <button onClick={() => setSaved(s => !s)} className="flex flex-col items-center gap-1 group">
          <div className="p-1.5 rounded-full transition-transform duration-150 group-active:scale-75">
            <Bookmark
              size={25}
              fill={saved ? 'white' : 'none'}
              stroke="white"
              strokeWidth={1.8}
            />
          </div>
        </button>

        {/* More */}
        <button className="p-1.5">
          <MoreHorizontal size={24} stroke="white" strokeWidth={1.8} />
        </button>

        {/* Mute */}
        <button onClick={onMuteToggle} className="p-1.5">
          {muted
            ? <VolumeX size={22} stroke="white" strokeWidth={1.8} />
            : <Volume2 size={22} stroke="white" strokeWidth={1.8} />
          }
        </button>
      </div>
    </div>
  )
}

/* ─── Skeleton ──────────────────────────────────────────────────── */
const ReelSkeleton = () => (
  <div
    className="relative flex-shrink-0 w-full h-full bg-zinc-900 overflow-hidden"
    style={{ scrollSnapAlign: 'start' }}
  >
    <div className="absolute inset-0 bg-zinc-800" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div className="absolute bottom-6 left-4 right-16 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-zinc-700" />
        <div className="w-24 h-3 rounded bg-zinc-700" />
      </div>
      <div className="w-48 h-2.5 rounded bg-zinc-700" />
      <div className="w-32 h-2 rounded bg-zinc-700/60" />
    </div>
    <div className="absolute right-3 bottom-6 flex flex-col gap-6 items-center">
      {[28, 28, 26, 26].map((s, i) => (
        <div key={i} className="rounded-full bg-zinc-700" style={{ width: s, height: s }} />
      ))}
    </div>
  </div>
)

/* ─── Main Reels Page ───────────────────────────────────────────── */
const Reels = () => {
  const dispatch = useDispatch()
  const { reels = [], loading } = useSelector((state) => state.reels)
  const [activeIndex, setActiveIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const containerRef = useRef(null)

  

  useEffect(() => {
    dispatch(getReels())
  }, [])

  // IntersectionObserver to track which reel is active
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            setActiveIndex(idx)
          }
        })
      },
      { root: container, threshold: 0.6 }
    )

    const cards = container.querySelectorAll('[data-index]')
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [reels, loading])

  return (
    <>
      <style>{`
        @keyframes heartPop {
          0%   { transform: scale(0);   opacity: 1; }
          50%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .reels-scroll {
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          scrollbar-width: none;
        }
        .reels-scroll::-webkit-scrollbar { display: none; }
        .reels-item {
          scroll-snap-align: start;
          flex-shrink: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="flex min-h-screen bg-black">
        <SideBar />

        {/* Reels viewport */}
        <div className="flex-1 flex justify-center items-center bg-zinc-950">
          <div
            ref={containerRef}
            className="reels-scroll relative bg-black"
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '100vh',
            }}
          >
            {loading
              ? Array(2).fill(0).map((_, i) => (
                  <div key={i} className="reels-item" style={{ height: '100vh' }}>
                    <ReelSkeleton />
                  </div>
                ))
              : reels.map((reel, i) => (
                  <div key={reel._id} className="reels-item" data-index={i} style={{ height: '100vh' }}>
                    <ReelCard
                      reel={reel}
                      isActive={activeIndex === i}
                      muted={muted}
                      onMuteToggle={() => setMuted(m => !m)}
                    />
                  </div>
                ))
            }

            {/* Empty state */}
            {!loading && reels.length === 0 && (
              <div className="h-screen flex flex-col items-center justify-center gap-4 text-zinc-600">
                <Play size={42} strokeWidth={1.2} />
                <p className="text-sm">No reels yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Reels