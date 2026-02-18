import { createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

const initialState = {
    stories: [],
    loading: false,
    error: null,
    isAuthenticated: false
}

export const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        setStories: (state, action) => {
            state.stories = action.payload
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
export const { setStories, setLoading, setError } = storySlice.actions

export default storySlice.reducer


// Get All Stories
export const getAllStories = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/story/all')
        if (data.success) {
            dispatch(setStories(data?.stories))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Stories Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}

