import { createSlice } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

const initialState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = !!action.payload
        },
        setSavedPosts: (state, action) => {
            if (state.user) {
                state.user.savedPosts = action.payload
            }
        },
       
    toggleFollowing: (state, action) => {
        if (!state.user) return;
        const targetId = action.payload;
        const isFollowing = state.user.following.includes(targetId);
        if (isFollowing) {
            state.user.following = state.user.following.filter(id => id !== targetId);
        } else {
            state.user.following.push(targetId);
        }
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
export const { setUser, setLoading,setSavedPosts, setError,toggleFollowing } = userSlice.actions

export default userSlice.reducer

// Register 
export const registerUser = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.post('/user/register',userData)
        if (data.success) {
            dispatch(setUser(data?.user))
            console.log(data);
            
            toast.success(data.message || "Registered SuccessFully")
            navigate("/")
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Register Failed"))
        toast.error(error?.response?.data?.message || "Registered Failed")
    } finally {
        dispatch(setLoading(false))
    }
}

// Login
export const loginUser = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.post('/user/login', userData)
        if (data.success) {
            dispatch(setUser(data?.user))
            toast.success(data.message || "Login SuccessFully")
            navigate("/")
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Login Failed"))
        toast.error(error?.response?.data?.message || "Login Failed")
    } finally {
        dispatch(setLoading(false))
    }
}

// Get Current USer
export const getCurrentUser = (userData, navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/user/profile')        
        if (data.success) {
            dispatch(setUser(data?.user))
        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Profile Get Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}

// Logout User
export const logoutUser = (navigate) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.get('/user/logout')
        if (data.success) {
            dispatch(setUser(null))
            toast.success(data.message || "Logut Success")
            navigate("/")

        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Logout Get Failed"))
        toast.error(error?.response?.data?.message || "Logout Get Failed")
    } finally {
        dispatch(setLoading(false))
    }
}
// Update Profile Image
export const updateProfileImage = (userData) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.post('/user/upload-profile', userData)
        if (data.success) {
            dispatch(setUser(data?.user))
            toast.success(data.message || "Profile Image Upadted Success")

        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Profile Image Upadte Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}
// Update User Profile 
export const updateUserProfile = (userData) => async (dispatch) => {
    dispatch(setLoading(true))
    try {
        const { data } = await axiosInstance.post('/user/update-profile', userData)
        if (data.success) {
            dispatch(setUser(data?.user))
            toast.success(data.message || "Profile Upadted Success")

        }
    } catch (error) {
        dispatch(setError(error?.response?.data?.message || "Profile  Upadte Failed"))
    } finally {
        dispatch(setLoading(false))
    }
}