import React, { useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import { useDispatch } from 'react-redux'
import { getAllPosts } from '../../redux/slices/postSlice'
import { getAllReels } from '../../redux/slices/reelSlice'
import { getAllStories } from '../../redux/slices/storySlice'

const CreateMedia = ({ type = "post" }) => {

  const dispatch = useDispatch()
  const [file, setfile] = useState(null)
  const [caption, setCaption] = useState("")
  const [mediaType, setMediaType] = useState("")
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
      }else {
        setError(data?.message || `${mediaType} Upload Failed`)
      }

    } catch (error) {
      console.log("Error While Uploading", error)
    }finally{
      setuploading(false)
    }
  }



  return (
    <>
      <h1>Helo</h1>
    </>
  )
}

export default CreateMedia