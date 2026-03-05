import React, { useState } from 'react'
import SideBar from '../components/ui/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getExplorePosts } from '../redux/slices/postSlice'
import { Heart, MessageCircle, Play, Search, TrendingUp } from 'lucide-react'

const formatCount = (n) => {
  if (!n) return '0'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

// Every 5th and 11th card in an 11-item pattern is a large 2×2 tile
const getGridClass = (index) => {
  const pattern = index % 11
  if (pattern === 0 || pattern === 6) return 'col-span-2 row-span-2'
  return 'col-span-1 row-span-1'
}

const PostCard = ({ post, index }) => {
  const [hovered, setHovered] = useState(false)
  const gridClass = getGridClass(index)
  const isLarge = gridClass.includes('col-span-2')

  return (
    <div
      className={`relative overflow-hidden bg-zinc-900 cursor-pointer ${gridClass}`}
      style={{ borderRadius: '4px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {post.mediaType === 'image' ? (
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
      ) : (
        <div className="relative w-full h-full">
          <video
            src={post.mediaUrl}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            muted loop playsInline
            autoPlay={hovered}
          />
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
            <Play size={9} fill="white" strokeWidth={0} />
            <span style={{ fontSize: '11px' }}>Reel</span>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{
          background: 'rgba(0,0,0,0.50)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div className="flex items-center gap-5">
          <span
            className="flex items-center gap-2 text-white font-bold"
            style={{
              fontSize: isLarge ? '17px' : '14px',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.22s ease 0.03s',
            }}
          >
            <Heart size={isLarge ? 19 : 16} fill="white" strokeWidth={0} />
            {formatCount(post.likes?.length)}
          </span>
          <span
            className="flex items-center gap-2 text-white font-bold"
            style={{
              fontSize: isLarge ? '17px' : '14px',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.22s ease 0.08s',
            }}
          >
            <MessageCircle size={isLarge ? 19 : 16} fill="white" strokeWidth={0} />
            {formatCount(post.comment?.length)}
          </span>
        </div>

        {isLarge && post.caption && (
          <p
            className="text-white/70 text-sm text-center px-8 leading-snug"
            style={{
              maxWidth: '280px',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.22s ease 0.13s',
            }}
          >
            {post.caption}
          </p>
        )}
      </div>
    </div>
  )
}

const SkeletonCard = ({ index }) => (
  <div
    className={`bg-zinc-800 rounded-sm ${getGridClass(index)}`}
    style={{
      animation: 'pulse 1.5s ease-in-out infinite',
      animationDelay: `${index * 0.06}s`,
    }}
  />
)

const Explore = () => {
  const dispatch = useDispatch()
  const { explorePosts, loading } = useSelector((state) => state.posts)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    dispatch(getExplorePosts())
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .explore-main { animation: fadeUp 0.35s ease both; }
        .explore-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 220px;
          gap: 3px;
        }
      `}</style>

      <div className="flex min-h-screen ">
        <SideBar />

        <main className="flex-1 overflow-y-auto explore-main">
          <div className="max-w-3xl mx-auto px-5 py-8">

            {/* Search */}
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center gap-2.5 w-full max-w-xs px-4 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: focused ? '#1d1d1d' : '#161616',
                  border: `1px solid ${focused ? '#383838' : '#202020'}`,
                }}
              >
                <Search size={15} color={focused ? '#888' : '#484848'} />
                <input
                  type="text"
                  placeholder="Search"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-zinc-600"
                />
              </div>
            </div>

            {/* Label */}
            <div className="flex items-center gap-2 mb-3 px-0.5">
              <TrendingUp size={14} color="#52525b" />
              <span className="text-xs font-semibold tracking-widest text-zinc-600 uppercase">
                Top Posts
              </span>
            </div>

            {/* Grid */}
            <div className="explore-grid">
              {loading
                ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} index={i} />)
                : explorePosts?.map((post, i) => (
                    <PostCard key={post._id} post={post} index={i} />
                  ))}
            </div>

            {/* Empty state */}
            {!loading && !explorePosts?.length && (
              <div className="flex flex-col items-center gap-3 py-32 text-zinc-700">
                <Search size={36} strokeWidth={1.2} />
                <p className="text-sm">Nothing to explore yet</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  )
}

export default Explore