import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFollowing } from '../redux/slices/userSlice';

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const targetId = post?.user?._id?.toString();

  //  All buttons for same user read from same Redux array — all sync together
  const isFollowing = currentUser?.following?.some(
    id => id.toString() === targetId
  );

  if (targetId === currentUser?._id?.toString()) return null;

  const handleFollow = async () => {
    dispatch(toggleFollowing(targetId)); //  Optimistic — ALL buttons update instantly
    try {
      setIsLoading(true);
      await axiosInstance.post(`/user/follow/${targetId}`);
    } catch (error) {
      dispatch(toggleFollowing(targetId)); //  Rollback ALL buttons on failure
      console.log(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? "..." : isFollowing ? (<button
      onClick={handleFollow}
      disabled={isLoading}
      className='bg-content text-white px-4 py-2 rounded-full hover:bg-surface transition text-sm disabled:opacity-50 disabled:cursor-not-allowed'
      >
      Following
    </button>) : (<button
      onClick={handleFollow}
      disabled={isLoading}
      className='bg-surface text-white px-4 py-2 rounded-full hover:bg-content transition text-sm disabled:opacity-50 disabled:cursor-not-allowed'
    >
      Follow
    </button>)}
      </>
   
  )
}

export default FollowButton