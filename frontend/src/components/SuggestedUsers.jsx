import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios';
import ProfileImage from './ProfileImage';
import FollowButton from './FollowButton';

const SuggestedUsers = () => {
    const [SuggestedUsers, setSuggestedUsers] = useState([])

    const fetchSuggestUsers = async () => {
        try {
            const res = await axiosInstance.get('/user/suggested/users');
            setSuggestedUsers(res.data.users);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchSuggestUsers();
    }, [])

    return (

        <>
            <div className='h-screen w-1/4  p-4 rounded-xl fixed right-5 top-5 hidden md:block'>
                <h2 className='text-lg font-semibold mb-4 pl-2 '>Suggested Users</h2>
                <div className=' p-2 bg-surface rounded-4xl'>
                    <div className='flex flex-col gap-4'>
                        {SuggestedUsers.map((user) => (
                            <div className='flex items-center bg-base rounded-full justify-between p-2'>
                                <ProfileImage user={user} username={user.username} className='w-8 h-8' />
                                <FollowButton user={user} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SuggestedUsers