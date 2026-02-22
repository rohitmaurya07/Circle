import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


const ProfileImage = ({ user, username, className }) => {
    const { user: currentUser } = useSelector(state => state.user)
    // console.log("user:", user);
    const isOnline = true
    return (
        <div className='flex items-center gap-3'>
            <div className={`${className ? className : 'w-8 h-8'} relative rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500`}>
                <img src={user?.profileImage || `https://placehold.co/150x150/000000/FFFFFF?text=${user?.username?.toUpperCase().slice(0, 1)}`} alt="profile" className="w-full h-full rounded-full object-cover border-2 border-gray-900" />
                {isOnline && user?._id !== currentUser?._id && <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white bg-green-500"></span>}
            </div>
            <Link to={`/profile/${user?._id}`}>
                <p className='font-semibold text-sm'>{username}</p>
            </Link>
        </div>
    )
}

export default ProfileImage
