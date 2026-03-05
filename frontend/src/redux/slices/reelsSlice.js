import { createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

const initialState = {
    reels: [],
    loading: false,
    error: null,
    isAuthenticated: false,
    userReels: [],
    exploreReels: []
}

export const reelsSlice = createSlice({
    name: 'reels',
    initialState,
    reducers: {
        setReels: (state, action) => {
            state.reels = action.payload
         },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setUserReels: (state, action) => {
            state.userReels = action.payload
        },
        setExploreReels: (state, action) => {
            state.exploreReels = action.payload
        }

    },
})

// Action creators are generated for each case reducer function
export const { setReels, setLoading, setError,setUserReels,setExploreReels } = reelsSlice.actions

export default reelsSlice.reducer


// Get All Posts
export const getReels = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/reel/all')
        if (data.success) {
            dispatch(setReels(data?.reels))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Reels Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}

// Get User Posts
export const getUserPosts = (userId) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get(`/user/post/${userId}`)
        if (data.success) {
            dispatch(setUserPosts(data?.posts))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Posts Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}

// Get User Saved Posts
export const getUserSavedPosts = (userId) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get(`/user/saved-posts/${userId}`)
        if (data.success) {
            dispatch(setUserSavedPosts(data?.savedPosts))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Saved Posts Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}

// Get Explore Posts
export const getExplorePosts = () => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/post/explore')
        console.log(data);
        
        if (data.success) {
            dispatch(setExplorePosts(data?.posts))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Posts Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}
