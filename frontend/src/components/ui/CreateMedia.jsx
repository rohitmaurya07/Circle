import React, { useEffect, useRef, useState } from 'react'

const CreateMedia = ({type = "posts"}) => {
  const [file, setfile] = useState(null)
  const [caption, setCaption] = useState("")
  const [previewUrl, setpreviewUrl] = useState('')
  const [uploading, setuploading] = useState(false)
  const [progress, setprogress] = useState(0)
  const [error, setError] = useState("")
  const [isDragging , setIsDragging] = useState(false)
  const [isPlaying , setIsPlaying] = useState(false)
  const [isMuted , setIsMuted] = useState(false)

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

  const handleFileSelect = (e)=>{
    const file = e.target.files[0]
    if(file){
      setfile(file)
      setpreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleFileChange = (e)=> handleFileSelect(e)

  const handleDragOver = (e)=>{
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e)=>{
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e)=>{
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if(file){
      handleFileSelect(file)
      setpreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  } 

  const handleClickDropArea = ()=>{
    fileInputRef.current.click()
  }

  const handleUpload = ()=>{
    e.preventDefault();
    if(!file) return setError("Please Select a File")
      setuploading(true)
      setError(null)
      setprogress(0)
      
      try {
          const formData = new FormData()
          formData.append("media",file)
          if (type !== "story") formData.append("caption",caption)
          formData.append("mediaType",file.type.startsWith("video") ? "video" : "image")
          
      } catch (error) {
          console.log("Error While Uploading",error)
      }
  }
  

  return (
    <>
      <h1>Helo</h1>
    </>
  )
}

export default CreateMedia