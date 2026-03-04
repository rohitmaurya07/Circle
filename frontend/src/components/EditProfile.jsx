import React, { useEffect, useState } from 'react'
import SideBar from './ui/SideBar'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'


const Field = ({ label, name, type = 'text', placeholder, half, form, setForm }) => (
  <div className={half ? "col-span-1" : "col-span-2"}>
    <label
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="block text-xs font-medium text-zinc-400 mb-1.5 tracking-wide uppercase"
    >
      {label}
    </label>
    <input
      type={type}
      value={form[name]}
      onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
      placeholder={placeholder}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl px-4 py-2.5 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
    />
  </div>
)


const EditProfile = () => {
  const { user: currentUser } = useSelector((state) => state.user)

  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    role: "",
  })

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        username: currentUser?.username || "",
        bio: currentUser?.bio || "",
        location: currentUser?.location || "",
        website: currentUser?.website || "",
        role: currentUser?.role || "",
      })
      setProfileImage(currentUser?.profileImage)
    }
  }, [currentUser])

  const saveData = async () => {
    try {
      console.log(form)
      const data = await axiosInstance.put('/user/update-profile', form)
      console.log(data)
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async () => {
    await saveData()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0]
      if (!file) {
        toast.error("Please select a file")
        return
      }
      setProfileImage(URL.createObjectURL(file))
      const formData = new FormData()
      formData.append("profileImage", file)
      setIsLoading(true)
      const data = await axiosInstance.post('/user/upload-profile', formData)
      if(data.status === 200){
        console.log(data.data.message);
        toast.success(data.data.message)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <SideBar />

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
              <p className="text-zinc-500 text-sm mt-1">Manage your personal information and preferences</p>
            </div>
            <button
              onClick={handleSave}
              className={`relative px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white active:scale-95'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                   ...
                  </>
                ) : 'Save Changes'}
              </span>
            </button>
          </div>

          {/* Avatar Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-5 tracking-wide uppercase">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/20 overflow-hidden">
                  {profileImage
                    ? <img className="w-full h-full object-cover" src={profileImage} alt="avatar" />
                    : <span>{currentUser?.name?.[0]?.toUpperCase() || "?"}</span>
                  }
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M15 3H21V9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M9 21H3V15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M21 3L14 10M3 21l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg font-medium transition-colors border border-zinc-700"/>
                  <button className="px-4 py-2 text-zinc-500 hover:text-zinc-300 text-sm rounded-lg font-medium transition-colors">
                    Remove
                  </button>
                </div>
                <p className="text-zinc-600 text-xs">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-5 tracking-wide uppercase">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="name" half placeholder="John Doe" form={form} setForm={setForm} />
              <Field label="Username" name="username" half placeholder="johndoe" form={form} setForm={setForm} />
              <Field label="Role / Title" name="role" half placeholder="e.g. Designer" form={form} setForm={setForm} />
              <Field label="Email Address" name="email" type="email" half placeholder="john@example.com" form={form} setForm={setForm} />
              <Field label="Location" name="location" placeholder="City, Country" form={form} setForm={setForm} />
            </div>
          </div>

          {/* Bio & Links */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-5 tracking-wide uppercase">Bio & Links</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 tracking-wide uppercase">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  style={{ fontFamily: "'DM Sans', sans-serif", resize: 'none' }}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-xl px-4 py-3 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                  placeholder="Tell people a little about yourself..."
                />
                <p className="text-zinc-600 text-xs mt-1.5">{form.bio.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 tracking-wide uppercase">Website</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                    placeholder="https://yoursite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-zinc-900 border border-red-900/40 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-red-400/80 mb-1 tracking-wide uppercase">Danger Zone</h2>
            <p className="text-zinc-500 text-sm mb-4">These actions are permanent and cannot be undone.</p>
            <div className="flex items-center justify-between py-3 border-b border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-300">Delete Account</p>
                <p className="text-xs text-zinc-600 mt-0.5">Permanently remove your account and all data</p>
              </div>
              <button className="px-4 py-2 border border-red-800 hover:bg-red-950 text-red-400 text-sm rounded-lg font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EditProfile