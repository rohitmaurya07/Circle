import { createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

const initialState = {
    posts: [],
    loading: false,
    error: null,
    isAuthenticated: false,
    userPosts: []
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
         },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setUserPosts: (state, action) => {
            state.userPosts = action.payload
        }

    },
})

// Action creators are generated for each case reducer function
export const { setPosts, setLoading, setError,setUserPosts } = postSlice.actions

export default postSlice.reducer


// Get All Posts
export const getAllPosts = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/post/all')
        if (data.success) {
            dispatch(setPosts(data?.posts))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Posts Get Failed"))
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