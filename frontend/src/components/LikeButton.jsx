import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { useSelector } from 'react-redux';
import ProfileImage from './ProfileImage';

const LikeButton = ({ post }) => {
  const [showLikes, setShowLikes] = useState(post?.likes);
  const { user: currentUser } = useSelector((state) => state.user);
  const [openLikedUsers, setOpenLikedUsers] = useState(false);
  const [likedUsersData, setlikedUsersData] = useState([])
 
console.log("yeyey",likedUsersData?.profileImage);

useEffect(() => {
  const fetchLikedUsers = async () => {
    try {
      const requests = showLikes.map(like =>
        axiosInstance.get(`/user/profile/${like}`)
      );
      const responses = await Promise.all(requests);
      const users = responses.map(res => res?.data?.user);
      setlikedUsersData(users);
    } catch (error) {
      console.log(error);
    }
  };

  if (showLikes?.length > 0) fetchLikedUsers();
}, [showLikes]); 

console.log("Liked USers Data",likedUsersData);



  // Toggle Post Likes 
  const handleToggleLike = async (postId) => {
  try {
    const res = await axiosInstance.put(`/post/${postId}/like`);
    setShowLikes(res?.data?.likes);
  } catch (error) {
    console.log(error);
  }
};

  // Update Instant Like Numbers
  useEffect(() => {
    setShowLikes(post?.likes)
  }, [post?.likes])

  // View Liked Users
  const viewLikedUsers = () => {
    setOpenLikedUsers(!openLikedUsers)
  }

  return (

    <>
    
    <div className=' flex flex-col '>
      <Heart
        onClick={() => handleToggleLike(post._id)}
        fill={showLikes?.some(id => id.toString() === currentUser?._id?.toString()) ? "red" : "none"}
        className="cursor-pointer hover:scale-110 transition "
      />
      {/* Likes */}
      {showLikes?.length.toLocaleString() > 0 && (
        <p onClick={()=>viewLikedUsers()} className=" font-semibold text-sm cursor-pointer">{showLikes?.length.toLocaleString() || "0"} likes</p>
      )}
      {/* <p className=" text-sm">
        <span className="font-semibold mr-2">{post?.user?.username}</span>
        {post?.caption}
      </p> */}

    </div>
    {/* // Liked Users Modal */}
    {
      openLikedUsers && (
      <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg px-8 py-5">
          <h2 className="text-lg font-semibold py-2">Liked By</h2>
          <ul className='py-2'>
            {likedUsersData.length > 0 ?  likedUsersData.map((user)=>{
              return (
                <div key={user._id} className='flex items-center gap-2 py-2'>
                  <ProfileImage user={user} width={50} height={50} />
                  <div className='flex flex-col'>
                    <p>{user?.username}</p>
                  </div>
                </div>
              )
            }) : <p>No Likes</p>}
          </ul>
          <button onClick={() => setOpenLikedUsers(false)} className='w-full py-2 bg-content text-white rounded-lg'>Close</button>
        </div>
      </div>
    )
  }

    </>
  )
}

export default LikeButton