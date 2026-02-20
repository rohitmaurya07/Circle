import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { useDispatch } from 'react-redux'
import { getAllStories } from '../../redux/slices/storySlice'
import { Image, Pause, Play, Upload, VideoIcon, Volume, VolumeX, X } from 'lucide-react'

const CreateMedia = ({ type = "post" }) => {

  const dispatch = useDispatch()
  const [file, setfile] = useState(null)
  const [caption, setCaption] = useState("")
  const [mediaType, setMediaType] = useState(type)
  const [previewUrl, setpreviewUrl] = useState('')
  const [uploading, setuploading] = useState(false)
  const [progress, setprogress] = useState(0)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    setfile(null)
    setpreviewUrl("")
    setCaption("")
    setuploading(false)
    setprogress(0)
    setError("")
    setIsDragging(false)
    setIsPlaying(false)
    setIsMuted(false)
  }, [type])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setfile(file)
      setpreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleFileChange = (e) => handleFileSelect(e)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
      setpreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleClickDropArea = () => {
    fileInputRef.current.click()
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please Select a File")
    setuploading(true)
    setError(null)
    setprogress(0)

    try {
      const formData = new FormData()
      formData.append("media", file)
      if (mediaType !== "story") formData.append("caption", caption)
      formData.append("mediaType", file.type.startsWith("video") ? "video" : "image")

      const apiEndPoint = mediaType === "story" ? "/story/create" : mediaType === "reel" ? "/reel/create" : "/post/create"
      const { data } = await axiosInstance.post(apiEndPoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setprogress(percentCompleted)
        }
      })

      if (data.success) {
        mediaType === "story" ? dispatch(getAllStories()) : ""
        // mediaType === "story" ? dispatch(getAllStories()) : mediaType === "reel" ? dispatch(getAllReels()) : dispatch(getAllPosts())
        setfile(null)
        setpreviewUrl("")
        setCaption("")
        setuploading(false)
        setprogress(0)
        setError("")
        setIsDragging(false)
        setIsPlaying(false)
        setIsMuted(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = null
        }
      } else {
        setError(data?.message || `${mediaType} Upload Failed`)
      }

    } catch (error) {
      console.log("Error While Uploading", error)
    } finally {
      setuploading(false)
    }
  }


  const titleMap = {
    story: "Create a New Story",
    reel: "Create a New Reel",
    post: "Create a New Post"
  }
  const buttonMap = {
    story: "Upload Story",
    reel: "Upload Reel",
    post: "Upload Post"
  }

  return (
    <>
      <div className='flex w-full flex-col items-center gap-4 p-5'>
        <div className='flex flex-col items-center gap-2 w-full'>
          <h2 className='text-2xl font-bold text-white text-center mb-2'>
            {titleMap[mediaType]}
          </h2>
          {
            mediaType !== "story" && (
              <div className='flex gap-4 w-full '>
                <button onClick={() => setMediaType("post")} type='button' className={`px-4 w-full py-2 rounded ${mediaType === "post" ? 'bg-linear-to-r form-purple-600 to-pink-500 text-white' : 'bg-gray-700 to-gray-300'}`}>Post</button>
                <button onClick={() => setMediaType("reel")} type='button' className={`px-4 w-full py-2 rounded ${mediaType === "reel" ? 'bg-linear-to-r form-purple-600 to-pink-500 text-white' : 'bg-gray-700 to-gray-300'}`}>Reel</button>
              </div>
            )
          }
        </div>

        <form onSubmit={handleUpload} className='space-y-5 w-full max-w-2xl'>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClickDropArea} className={`w-full max-h-80 h-44 p-3 rounded-xl border-2 border-dashed flex flex-col 
            items-center justify-center cursor-pointer relative overflow-hidden 
            ${isDragging ? 'border-purple-500 bg-purple-900/10' : 'border-gray-600 bg-gray-800/50'}`}>
            {!previewUrl ? <div className='flex flex-col items-center text-gray-400 space-y-2'>
              <Upload size={36} className='text-gray-400' />
              <p className='text-sm'>{isDragging ? "Drop your file here" : "Click or Drag file to upload"}</p>
              <p className='text-xs text-gray-500'>Supports: JPG, PNG, GIF, MP4, MOV</p>
              <div className='flex items-center gap-6 mt-2'>
                <div className='flex flex-col items-center'>
                  <Image size={28} />
                  <VideoIcon size={28} />
                </div>
              </div>
            </div> :
              <div>
                  {file?.type?.startsWith("video") ? 
                  <>
                    <video src={previewUrl} ref={videoRef} onClick={() => setIsPlaying(!isPlaying)} muted={isMuted} className='w-full h-full object-cover rounded-xl' />
                    <div className='absolute bottom-2 left-2 flex gap-2 bg-black rounded-2xl p-1'>
                        <button type='button' onClick={()=>isPlaying?videoRef.current.pause():videoRef.current.play()}>
                          {isPlaying?<Pause size={24}/>:<Play size={24}/>}
                        </button>
                        <button type='button' onClick={()=>videoRef.current.muted=!videoRef.current.muted}>
                          {isMuted?<VolumeX size={24}/>:<Volume size={24}/>}
                        </button>
                        <button type='button' onClick={()=>setpreviewUrl("")}>
                          <X size={24}/>
                        </button>
                    </div>
                  </> : 
                  <>
                    <img src={previewUrl} alt="" className='w-full h-full object-cover rounded-xl' />
                    <button type='button' onClick={()=>setpreviewUrl("")}>
                          <X size={24}/>
                        </button>
                  </>}
              </div>}
          </div>

          <input type="file" accept='image/* , video/*' onChange={handleFileChange} ref={fileInputRef} className='hidden' />
          {mediaType !== "story" && (
            <div className='flex flex-col gap-2'>
              <label htmlFor="caption" className='text-gray-400'>Caption</label>
              <textarea id="caption" value={caption} onChange={(e)=>setCaption(e.target.value)} className='w-full p-2 rounded-xl bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500' />
            </div>)}
            {uploading && (
              <div className='flex items-center gap-2 bg-red-800'>
                <div className='w-full bg-gray-800 rounded-full h-2.5'>
                  <div className='bg-purple-600 h-2.5 rounded-full' style={{width: `${progress}%`}}></div>
                </div>
                <span className='text-gray-400'>{progress}%</span>
              </div>
            )}
            {error && <p className='text-red-500 text-center'>{error}</p>}
            <button type='submit' disabled={uploading} className='w-full py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-500 text-white'>
              {uploading ? "Uploading..." : buttonMap[mediaType]}
            </button>
        </form>
      </div>
    </>
  )
}

export default CreateMedia