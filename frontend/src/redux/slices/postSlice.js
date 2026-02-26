import { createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

const initialState = {
    posts: [],
    loading: false,
    error: null,
    isAuthenticated: false
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

    },
})

// Action creators are generated for each case reducer function
export const { setPosts, setLoading, setError } = postSlice.actions

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

